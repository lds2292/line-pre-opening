import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { create } from 'https://deno.land/x/djwt@v3.0.2/mod.ts'

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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const { code } = await req.json()

    if (!code || typeof code !== 'string') {
      return new Response(JSON.stringify({ error: 'Code is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const trimmedCode = code.trim().toUpperCase()
    if (trimmedCode.length < 1 || trimmedCode.length > 16) {
      return new Response(JSON.stringify({ error: 'Invalid code format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const key = await getJwtKey()

    // 테스트 코드 처리: DB 조회 없이 통과, used 처리 안 함
    const testCode = Deno.env.get('TEST_CODE')
    if (testCode && trimmedCode === testCode.trim().toUpperCase()) {
      const token = await create(
        { alg: 'HS256', typ: 'JWT' },
        {
          sub: 'test',
          label: 'TEST',
          exp: Math.floor(Date.now() / 1000) + 3600,
        },
        key
      )
      return new Response(JSON.stringify({ success: true, token }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: authCode, error: selectError } = await supabase
      .from('auth_codes')
      .select('*')
      .eq('code', trimmedCode)
      .eq('used', false)
      .single()

    if (selectError || !authCode) {
      return new Response(JSON.stringify({ error: 'Invalid or already used code' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { error: updateError } = await supabase
      .from('auth_codes')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('id', authCode.id)

    if (updateError) {
      throw updateError
    }

    const token = await create(
      { alg: 'HS256', typ: 'JWT' },
      {
        sub: authCode.id,
        label: authCode.label,
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
      key
    )

    return new Response(JSON.stringify({ success: true, token }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('auth-verify error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
