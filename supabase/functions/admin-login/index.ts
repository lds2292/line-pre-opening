import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts'
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
    const { username, password } = await req.json()

    console.log('[admin-login] username received:', username)
    console.log('[admin-login] password length:', password?.length)

    if (!username || !password) {
      console.log('[admin-login] missing username or password')
      return new Response(JSON.stringify({ error: 'Username and password are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const storedHash = Deno.env.get('ADMIN_PASSWORD_HASH')
    const expectedUsername = Deno.env.get('ADMIN_USERNAME')

    console.log('[admin-login] ADMIN_USERNAME set:', !!expectedUsername)
    console.log('[admin-login] ADMIN_PASSWORD_HASH set:', !!storedHash)
    console.log('[admin-login] ADMIN_PASSWORD_HASH prefix:', storedHash?.slice(0, 7))
    console.log('[admin-login] JWT_SECRET set:', !!Deno.env.get('JWT_SECRET'))

    if (!storedHash || !expectedUsername) {
      console.error('[admin-login] secrets not configured')
      return new Response(JSON.stringify({ error: 'Server misconfiguration' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // compareSync 사용 (Supabase Edge Runtime은 Worker 미지원)
    const passwordMatch = bcrypt.compareSync(password, storedHash)
    const usernameMatch = username === expectedUsername

    console.log('[admin-login] passwordMatch:', passwordMatch)
    console.log('[admin-login] usernameMatch:', usernameMatch)

    if (!passwordMatch || !usernameMatch) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const key = await getJwtKey()
    const token = await create(
      { alg: 'HS256', typ: 'JWT' },
      {
        role: 'admin',
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
      key
    )

    console.log('[admin-login] login success')
    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[admin-login] unexpected error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
