CREATE TABLE auth_codes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code       VARCHAR(8) UNIQUE NOT NULL,
  label      VARCHAR(100),
  used       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_at    TIMESTAMPTZ
);

CREATE INDEX idx_auth_codes_code ON auth_codes(code);

ALTER TABLE auth_codes ENABLE ROW LEVEL SECURITY;
-- anon権限なし。全アクセスはEdge Function(service_role key)経由のみ。
