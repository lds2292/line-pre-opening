<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="logo-area">
        <div class="logo-circle">
          <span class="logo-text">Liné</span>
        </div>
        <h1 class="clinic-name">リネ美容外科</h1>
        <p class="clinic-sub">Liné Plastic Surgery Clinic</p>
      </div>

      <div class="form-area">
        <p class="form-desc">招待コードを入力してください</p>
        <form @submit.prevent="handleSubmit">
          <input
            v-model="code"
            type="text"
            class="code-input"
            placeholder="招待コード"
            maxlength="8"
            autocomplete="off"
            spellcheck="false"
            :disabled="loading"
          />
          <button type="submit" class="submit-btn" :disabled="loading || !code.trim()">
            <span v-if="loading">確認中...</span>
            <span v-else>入室する</span>
          </button>
        </form>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/index.js'
import { setSessionToken } from '../store/session.js'

const router = useRouter()
const code = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function handleSubmit() {
  errorMsg.value = ''
  loading.value = true

  try {
    const res = await api.post('/auth-verify', { code: code.value })
    setSessionToken(res.data.token)
    router.push('/secret')
  } catch (err) {
    const status = err.response?.status
    if (status === 401) {
      errorMsg.value = 'コードが無効か、すでに使用されています。'
    } else if (status === 429) {
      errorMsg.value = 'しばらく時間をおいて再度お試しください。'
    } else {
      errorMsg.value = 'エラーが発生しました。もう一度お試しください。'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #faf9f7;
  padding: 20px;
}

.auth-card {
  background: #fff;
  border-radius: 16px;
  padding: 48px 40px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  text-align: center;
}

.logo-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #6b4fa0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.logo-text {
  color: #fff;
  font-size: 22px;
  font-style: italic;
  font-weight: 300;
  letter-spacing: 1px;
}

.clinic-name {
  font-size: 20px;
  font-weight: 500;
  color: #2c2c2c;
  margin: 0 0 4px;
  letter-spacing: 0.05em;
}

.clinic-sub {
  font-size: 13px;
  color: #888;
  margin: 0 0 32px;
  letter-spacing: 0.03em;
}

.form-desc {
  font-size: 14px;
  color: #555;
  margin: 0 0 16px;
}

.code-input {
  width: 100%;
  padding: 14px 16px;
  font-size: 18px;
  text-align: center;
  letter-spacing: 4px;
  text-transform: uppercase;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.code-input:focus {
  border-color: #6b4fa0;
}

.submit-btn {
  width: 100%;
  margin-top: 12px;
  padding: 14px;
  background: #6b4fa0;
  color: #fff;
  font-size: 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  letter-spacing: 0.05em;
}

.submit-btn:hover:not(:disabled) {
  background: #5a3e8a;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-msg {
  margin-top: 14px;
  font-size: 13px;
  color: #e05050;
}
</style>
