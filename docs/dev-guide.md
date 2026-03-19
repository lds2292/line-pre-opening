# 개발 가이드

## 아키텍처 개요

```
secret-view/
├── client/          # Vue3 사용자 페이지 → Netlify 배포
├── admin/           # Vue3 어드민 페이지 → Netlify 배포 (별도 사이트)
├── supabase/        # Supabase Edge Functions (Deno 런타임)
│   ├── functions/
│   │   ├── auth-verify/   # POST - 인증번호 검증
│   │   ├── admin-login/   # POST - 어드민 로그인
│   │   ├── admin-codes/   # GET (목록), POST (생성)
│   │   └── admin-code/    # POST (재발급), DELETE (삭제)
│   └── config.toml
└── docs/
```

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | Vue3 + Vite + Vue Router + Axios |
| 백엔드 | Supabase Edge Functions (Deno) |
| 데이터베이스 | Supabase (PostgreSQL) |
| 배포 | Netlify (client/admin) + Supabase (DB + Functions) |

## 로컬 개발 환경

```bash
# 루트에서 전체 의존성 설치
npm install
cd client && npm install && cd ..
cd admin && npm install && cd ..

# 환경변수 설정
cp client/.env.example client/.env.local
cp admin/.env.example admin/.env.local
# VITE_API_URL을 Supabase Functions URL로 변경

# 개발 서버 동시 실행 (client: 5173, admin: 5174)
npm run dev
```

## Edge Functions

### 공통 패턴

모든 함수는 CORS preflight(OPTIONS)를 처리하고 `service_role key`로 DB에 접근합니다.

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
}
```

### 의존성

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { create, verify } from 'https://deno.land/x/djwt@v3.0.2/mod.ts'
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts'
```

> ⚠️ `bcrypt.compare()` 대신 `bcrypt.compareSync()` 사용 필수
> Supabase Edge Runtime에서 Web Worker API가 지원되지 않아 async 버전 사용 불가

### JWT

- 알고리즘: HMAC SHA-256 (djwt)
- 만료: 발급 후 1시간
- Secret: `Deno.env.get('JWT_SECRET')` (64자 이상 권장)

### auth-verify 흐름

1. 입력값 trim·uppercase
2. `TEST_CODE`와 일치하면 DB 조회 없이 JWT 발급
3. DB에서 `used=false`인 코드 조회
4. `used=true`, `used_at=NOW()` 업데이트
5. JWT 발급 후 반환

### 코드 생성 로직

충돌 방지를 위해 최대 3회 재시도합니다.

```typescript
// crypto로 6바이트 생성 → base64url → 8자 uppercase
const bytes = crypto.getRandomValues(new Uint8Array(6))
const code = btoa(String.fromCharCode(...bytes))
  .replace(/\+/g, 'A').replace(/\//g, 'B').replace(/=/g, '')
  .slice(0, 8).toUpperCase()
```

## 세션 관리 (client)

현재 메모리 저장 방식(Phase 1)으로 브라우저 닫으면 세션이 초기화됩니다.

```js
// client/src/store/session.js
let _token = null
export const getSessionToken   = () => _token
export const setSessionToken   = (t) => { _token = t }
export const clearSessionToken = () => { _token = null }
```

localStorage 방식으로 전환 시 `setSessionToken`/`clearSessionToken`에 한 줄씩만 추가하면 됩니다.

## 라우터 가드

```js
// client: /secret는 토큰 없으면 /로 리다이렉트
// admin: /dashboard는 어드민 토큰 없으면 /로 리다이렉트
```

## Netlify 배포 설정

Netlify 대시보드 **Site configuration → Build & deploy → Build settings** 에서 설정:

| 사이트 | Base directory | Build command | Publish directory |
|--------|---------------|---------------|------------------|
| client | `client` | `npm run build` | `client/dist` |
| admin  | `admin`  | `npm run build` | `admin/dist`  |

환경변수: `VITE_API_URL=https://<project-ref>.supabase.co/functions/v1`
