# 셋업 가이드

## 1. Supabase 프로젝트 생성

1. [supabase.com](https://supabase.com) 에서 프로젝트 생성
   - Region: Tokyo (`ap-northeast-1`)
2. SQL Editor에서 `supabase/migrations/001_init.sql` 실행

## 2. Supabase Secrets 설정

```bash
# Supabase CLI 설치 (미설치 시)
brew install supabase/tap/supabase

# 로그인 & 프로젝트 링크
supabase login
supabase link --project-ref <project-ref>

# JWT_SECRET: 64자 이상의 랜덤 문자열
supabase secrets set JWT_SECRET=cea8b22dba5a8acbc3f1f8dcedad40e69149222eed44839ba4a315bccad4684d60deb812710bfc4e6a739eafa8c3642bc597ebdd839b7deb941d7c549543f018

# ADMIN_USERNAME
supabase secrets set ADMIN_USERNAME=superadmin

# ADMIN_PASSWORD_HASH: bcrypt 해시 (Node.js로 로컬에서 생성)
# node -e "console.log(require('bcryptjs').hashSync('raoly9999@@@@', 12))"
supabase secrets set ADMIN_PASSWORD_HASH='$2b$12$5LkNnLWNxQ8RLr20sKt92uUneKOXfMi3nq4n972XKmJWZTJSD2Zhe'
```

## 3. Edge Functions 배포

```bash
supabase functions deploy auth-verify
supabase functions deploy admin-login
supabase functions deploy admin-codes
supabase functions deploy admin-code
```

## 4. 로컬 개발

```bash
# 루트에서 의존성 설치
npm install

# client와 admin 의존성 설치
cd client && npm install && cd ..
cd admin && npm install && cd ..

# .env 파일 생성
cp client/.env.example client/.env.local
cp admin/.env.example admin/.env.local
# 각 파일의 VITE_API_URL을 실제 Supabase Functions URL로 변경

# 개발 서버 실행 (client: 5173, admin: 5174)
npm run dev
```

## 5. Netlify 배포

### Client 사이트
- Base directory: `client`
- Build command: `npm run build`
- Publish directory: `dist`
- 환경변수: `VITE_API_URL=https://<project-ref>.supabase.co/functions/v1`

### Admin 사이트
- Base directory: `admin`
- Build command: `npm run build`
- Publish directory: `dist`
- 환경변수: `VITE_API_URL=https://<project-ref>.supabase.co/functions/v1`

## curl 테스트 예시

```bash
# 코드 검증
curl -X POST https://<ref>.supabase.co/functions/v1/auth-verify \
  -H "Content-Type: application/json" \
  -d '{"code": "ABCD1234"}'

# 어드민 로그인
curl -X POST https://<ref>.supabase.co/functions/v1/admin-login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "yourpassword"}'

# 코드 목록 조회 (TOKEN은 admin-login에서 발급받은 값)
curl https://<ref>.supabase.co/functions/v1/admin-codes \
  -H "Authorization: Bearer <TOKEN>"

# 코드 생성
curl -X POST https://<ref>.supabase.co/functions/v1/admin-codes \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"label": "홍길동님"}'
```
