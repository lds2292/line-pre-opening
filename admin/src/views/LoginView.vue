<template>
  <div class="login-container">
    <div class="login-card">
      <!-- 언어 선택 -->
      <div class="lang-selector">
        <select v-model="currentLang" @change="setLang(currentLang)">
          <option value="ko">한국어</option>
          <option value="ja">日本語</option>
        </select>
      </div>

      <div class="login-header">
        <div class="logo-circle">
          <span class="logo-text">Liné</span>
        </div>
        <h1>{{ t.adminPanel }}</h1>
        <p class="sub">Admin Dashboard</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="field">
          <label>{{ t.username }}</label>
          <input v-model="username" type="text" autocomplete="username" :disabled="loading" />
        </div>
        <div class="field">
          <label>{{ t.password }}</label>
          <input v-model="password" type="password" autocomplete="current-password" :disabled="loading" />
        </div>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
        <button type="submit" class="login-btn" :disabled="loading || !username || !password">
          {{ loading ? t.loggingIn : t.login }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/client.js'
import { setAdminToken } from '../store/auth.js'
import { lang, setLang, t } from '../store/lang.js'

const router = useRouter()
const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const currentLang = ref(lang.value)

async function handleLogin() {
  errorMsg.value = ''
  loading.value = true
  try {
    const res = await api.post('/admin-login', {
      username: username.value,
      password: password.value,
    })
    setAdminToken(res.data.token)
    router.push('/dashboard')
  } catch (err) {
    errorMsg.value = err.response?.status === 401
      ? t.value.loginError401
      : t.value.loginErrorDefault
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f2f8;
  padding: 20px;
}

.login-card {
  background: #fff;
  border-radius: 12px;
  padding: 40px 36px;
  max-width: 380px;
  width: 100%;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  position: relative;
}

.lang-selector {
  position: absolute;
  top: 16px;
  right: 16px;
}

.lang-selector select {
  font-size: 12px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  color: #555;
  cursor: pointer;
  outline: none;
}

.lang-selector select:hover {
  border-color: #6b4fa0;
}

.login-header {
  text-align: center;
  margin-bottom: 28px;
}

.logo-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #6b4fa0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.logo-text {
  color: #fff;
  font-size: 16px;
  font-style: italic;
  font-weight: 300;
}

h1 {
  margin: 0 0 4px;
  font-size: 20px;
  color: #2c2c2c;
}

.sub {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.field {
  margin-bottom: 16px;
}

.field label {
  display: block;
  font-size: 13px;
  color: #555;
  margin-bottom: 6px;
}

.field input {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #ddd;
  border-radius: 6px;
  font-size: 16px; /* iOS 사파리 자동 줌 방지 */
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.field input:focus {
  border-color: #6b4fa0;
}

.error-msg {
  font-size: 13px;
  color: #e05050;
  margin: 0 0 12px;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: #6b4fa0;
  color: #fff;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.login-btn:hover:not(:disabled) {
  background: #5a3e8a;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
