import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { verify } from 'https://deno.land/x/djwt@v3.0.2/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
}

async function getJwtKey(): Promise<CryptoKey> {
  const secret = Deno.env.get('JWT_SECRET')!
  const encoder = new TextEncoder()
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

async function verifyAdminToken(req: Request): Promise<boolean> {
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return false

  try {
    const key = await getJwtKey()
    const payload = await verify(token, key)
    return payload.role === 'admin'
  } catch {
    return false
  }
}

function generateCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, 'A')
    .replace(/\//g, 'B')
    .replace(/=/g, '')
    .slice(0, 8)
    .toUpperCase()
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const isAdmin = await verifyAdminToken(req)
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // POST: Reissue code
  if (req.method === 'POST') {
    const { id } = await req.json()

    if (!id) {
      return new Response(JSON.stringify({ error: 'id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 코드 충돌 시 최대 3회 재시도
    let data = null
    let lastError = null
    for (let attempt = 0; attempt < 3; attempt++) {
      const newCode = generateCode()
      const result = await supabase
        .from('auth_codes')
        .update({ code: newCode, used: false, used_at: null })
        .eq('id', id)
        .select()
        .single()

      if (!result.error) {
        data = result.data
        break
      }
      // 23505 = unique_violation
      if (result.error.code !== '23505') {
        lastError = result.error
        break
      }
      lastError = result.error
    }

    if (!data) {
      return new Response(JSON.stringify({ error: lastError?.message ?? 'Update failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ code: data }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // DELETE: Remove code
  if (req.method === 'DELETE') {
    const { id } = await req.json()

    if (!id) {
      return new Response(JSON.stringify({ error: 'id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { error } = await supabase
      .from('auth_codes')
      .delete()
      .eq('id', id)

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
