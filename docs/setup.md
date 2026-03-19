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
supabase secrets set JWT_SECRET=

# ADMIN_USERNAME
supabase secrets set ADMIN_USERNAME=

# ADMIN_PASSWORD_HASH: bcrypt 해시 (Node.js로 로컬에서 생성)
# node -e "console.log(require('bcryptjs').hashSync('raoly9999@@@@', 12))"
supabase secrets set ADMIN_PASSWORD_HASH='$2b$1~~~'

# TEST_CODE: 항상 사용 가능한 테스트용 코드 (DB에 저장되지 않음)
# 원하는 문자열로 설정 (대소문자 무관, 최대 16자)
supabase secrets set TEST_CODE=TESTCODE
```

## 3. 테스트 코드 비활성화 (정식 오픈 시)

```bash
# TEST_CODE 삭제 → 이후 해당 코드 입력 시 401 반환
supabase secrets unset TEST_CODE

# 적용을 위해 함수 재배포 필요
supabase functions deploy auth-verify
```

> ⚠️ 정식 오픈(4월 17일) 전에 반드시 실행할 것

## 4. Edge Functions 배포

```bash
supabase functions deploy auth-verify
supabase functions deploy admin-login
supabase functions deploy admin-codes
supabase functions deploy admin-code
```

## 5. 로컬 개발

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

## 6. Netlify 배포

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

## 7. 관리자 계정 변경

관리자 아이디 또는 패스워드를 변경할 경우 아래 절차를 따릅니다.

```bash
# 아이디 변경
supabase secrets set ADMIN_USERNAME=새아이디

# 패스워드 변경
# 1) 먼저 bcrypt 해시 생성 (bcryptjs 미설치 시: npm install -g bcryptjs)
node -e "console.log(require('bcryptjs').hashSync('새패스워드', 12))"

# 2) 생성된 해시로 secret 업데이트
supabase secrets set ADMIN_PASSWORD_HASH='생성된해시값'

# 3) secrets 변경 후 반드시 함수 재배포
supabase functions deploy admin-login
```

> ⚠️ 재배포를 하지 않으면 변경사항이 반영되지 않습니다.

## 8. curl 테스트 예시

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
