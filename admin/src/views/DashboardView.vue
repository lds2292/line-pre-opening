<template>
  <div class="dashboard">
    <!-- 상단 진행 바 -->
    <div class="progress-bar" :class="{ active: globalBusy }"></div>

    <!-- Header -->
    <header class="dash-header">
      <div class="header-left">
        <div class="logo-circle-sm">Liné</div>
        <span class="header-title">{{ t.adminPanel }}</span>
      </div>
      <div class="header-right">
        <select v-model="currentLang" class="lang-select" @change="setLang(currentLang)">
          <option value="ko">한국어</option>
          <option value="ja">日本語</option>
        </select>
        <button class="logout-btn" @click="handleLogout">{{ t.logout }}</button>
      </div>
    </header>

    <main class="dash-main">
      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-num">{{ codes.length }}</div>
          <div class="stat-label">{{ t.totalCodes }}</div>
        </div>
        <div class="stat-card used">
          <div class="stat-num">{{ usedCount }}</div>
          <div class="stat-label">{{ t.usedCodes }}</div>
        </div>
        <div class="stat-card unused">
          <div class="stat-num">{{ unusedCount }}</div>
          <div class="stat-label">{{ t.unusedCodes }}</div>
        </div>
      </div>

      <!-- Create new code -->
      <div class="create-section">
        <h2 class="section-title">{{ t.createCode }}</h2>
        <div class="create-form">
          <input
            v-model="newLabel"
            type="text"
            :placeholder="t.labelPlaceholder"
            class="label-input"
            @keyup.enter="createCode"
          />
          <button class="create-btn" :disabled="creating" @click="createCode">
            {{ creating ? t.generating : t.generate }}
          </button>
        </div>
        <div v-if="newlyCreated" class="new-code-banner">
          <span class="new-code-value">{{ newlyCreated.code }}</span>
          <span class="new-code-label">{{ newlyCreated.label || t.noLabel }}</span>
          <button class="copy-btn" @click="copyCode(newlyCreated.code)">{{ t.copy }}</button>
        </div>
      </div>

      <!-- Code list -->
      <div class="table-section">
        <div class="table-header">
          <h2 class="section-title">{{ t.codeList }}</h2>
          <div class="table-controls">
            <!-- 상태 필터 -->
            <div class="filter-tabs">
              <button
                v-for="f in filters"
                :key="f.value"
                class="filter-tab"
                :class="{ active: statusFilter === f.value }"
                @click="statusFilter = f.value"
              >
                {{ f.label }}
              </button>
            </div>
            <!-- 검색 -->
            <div class="search-wrap">
              <input
                v-model="searchQuery"
                type="text"
                class="search-input"
                :placeholder="t.searchPlaceholder"
              />
              <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">✕</button>
            </div>
          </div>
        </div>

        <div v-if="loadingCodes" class="loading-text">{{ t.loading }}</div>
        <div v-else-if="codes.length === 0" class="empty-text">{{ t.empty }}</div>
        <div v-else-if="filteredCodes.length === 0" class="empty-text">{{ t.emptyFiltered }}</div>
        <template v-else>
          <!-- 데스크톱: 테이블 -->
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>{{ t.colCode }}</th>
                  <th>{{ t.colLabel }}</th>
                  <th>{{ t.colStatus }}</th>
                  <th>{{ t.colCreatedAt }}</th>
                  <th>{{ t.colUsedAt }}</th>
                  <th>{{ t.colActions }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="c in filteredCodes"
                  :key="c.id"
                  :class="{ 'row-new': newlyCreated && c.id === newlyCreated.id }"
                >
                  <td class="code-cell">{{ c.code }}</td>
                  <td>{{ c.label || '—' }}</td>
                  <td>
                    <span :class="c.used ? 'badge used' : 'badge unused'">
                      {{ c.used ? t.used : t.unused }}
                    </span>
                  </td>
                  <td>{{ formatDate(c.created_at) }}</td>
                  <td>{{ c.used_at ? formatDate(c.used_at) : '—' }}</td>
                  <td class="actions-cell">
                    <button class="action-btn btn-copy" @click="copyCode(c.code)">
                      {{ t.btnCopy }}
                    </button>
                    <button
                      class="action-btn btn-reissue"
                      :disabled="!c.used || pendingId === c.id"
                      @click="reissueCode(c)"
                    >
                      {{ pendingId === c.id ? '...' : t.btnReissue }}
                    </button>
                    <button
                      class="action-btn btn-delete"
                      :disabled="pendingId === c.id"
                      @click="deleteCode(c)"
                    >
                      {{ pendingId === c.id ? '...' : t.btnDelete }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 모바일: 카드 -->
          <div class="code-cards">
            <div
              v-for="c in filteredCodes"
              :key="c.id"
              class="code-card"
              :class="{ 'card-new': newlyCreated && c.id === newlyCreated.id }"
            >
              <div class="card-top">
                <span class="card-code">{{ c.code }}</span>
                <span :class="c.used ? 'badge used' : 'badge unused'">
                  {{ c.used ? t.used : t.unused }}
                </span>
              </div>
              <div class="card-label">{{ c.label || '—' }}</div>
              <div class="card-dates">
                <span>{{ t.colCreatedAt }}: {{ formatDate(c.created_at) }}</span>
                <span v-if="c.used_at">{{ t.colUsedAt }}: {{ formatDate(c.used_at) }}</span>
              </div>
              <div class="card-actions">
                <button class="action-btn btn-copy" @click="copyCode(c.code)">
                  {{ t.btnCopy }}
                </button>
                <button
                  class="action-btn btn-reissue"
                  :disabled="!c.used || pendingId === c.id"
                  @click="reissueCode(c)"
                >
                  {{ pendingId === c.id ? '...' : t.btnReissue }}
                </button>
                <button
                  class="action-btn btn-delete"
                  :disabled="pendingId === c.id"
                  @click="deleteCode(c)"
                >
                  {{ pendingId === c.id ? '...' : t.btnDelete }}
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Toast -->
      <div v-if="toast" class="toast" :class="toast.type">{{ toast.msg }}</div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/client.js'
import { clearAdminToken } from '../store/auth.js'
import { lang, setLang, t } from '../store/lang.js'

const router = useRouter()
const currentLang = ref(lang.value)

const codes = ref([])
const loadingCodes = ref(false)
const creating = ref(false)
const pendingId = ref(null)
const newLabel = ref('')
const newlyCreated = ref(null)
const toast = ref(null)

const globalBusy = computed(() => loadingCodes.value || creating.value || pendingId.value !== null)

const statusFilter = ref('all')
const searchQuery = ref('')

const filters = computed(() => [
  { value: 'all',    label: t.value.filterAll },
  { value: 'unused', label: t.value.filterUnused },
  { value: 'used',   label: t.value.filterUsed },
])

const filteredCodes = computed(() => {
  let list = codes.value

  if (statusFilter.value === 'used')   list = list.filter((c) => c.used)
  if (statusFilter.value === 'unused') list = list.filter((c) => !c.used)

  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        (c.label && c.label.toLowerCase().includes(q))
    )
  }

  return list
})

const usedCount = computed(() => codes.value.filter((c) => c.used).length)
const unusedCount = computed(() => codes.value.filter((c) => !c.used).length)

function showToast(msg, type = 'success') {
  toast.value = { msg, type }
  setTimeout(() => { toast.value = null }, 3000)
}

function formatDate(iso) {
  if (!iso) return '—'
  const locale = lang.value === 'ja' ? 'ja-JP' : 'ko-KR'
  const d = new Date(iso)
  return d.toLocaleDateString(locale, { year: 'numeric', month: '2-digit', day: '2-digit' })
    + ' ' + d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
}

async function fetchCodes() {
  loadingCodes.value = true
  try {
    const res = await api.get('/admin-codes')
    codes.value = res.data.codes
  } catch {
    showToast(t.value.toastFetchFail, 'error')
  } finally {
    loadingCodes.value = false
  }
}

async function createCode() {
  if (creating.value) return

  const trimmedLabel = newLabel.value.trim()
  if (trimmedLabel) {
    const isDuplicate = codes.value.some(
      (c) => c.label?.trim().toLowerCase() === trimmedLabel.toLowerCase()
    )
    if (isDuplicate) {
      showToast(t.value.errorDuplicateLabel, 'error')
      return
    }
  }

  creating.value = true
  newlyCreated.value = null
  try {
    const res = await api.post('/admin-codes', { label: trimmedLabel || undefined })
    const created = res.data.code
    codes.value.unshift(created)
    newlyCreated.value = created
    newLabel.value = ''
    statusFilter.value = 'all'
    searchQuery.value = ''
    showToast(t.value.toastCreated(created.code))
  } catch (err) {
    const msg = err.response?.data?.error === 'DUPLICATE_LABEL'
      ? t.value.errorDuplicateLabel
      : t.value.toastCreateFail
    showToast(msg, 'error')
  } finally {
    creating.value = false
  }
}

async function copyCode(code) {
  try {
    await navigator.clipboard.writeText(code)
    showToast(t.value.toastCopied(code))
  } catch {
    showToast(t.value.toastCopyFail, 'error')
  }
}

async function reissueCode(c) {
  if (!confirm(t.value.confirmReissue(c.label || c.code))) return
  pendingId.value = c.id
  try {
    const res = await api.post('/admin-code', { id: c.id })
    const updated = res.data.code
    const idx = codes.value.findIndex((x) => x.id === c.id)
    if (idx !== -1) codes.value[idx] = updated
    showToast(t.value.toastReissued(updated.code))
  } catch {
    showToast(t.value.toastReissueFail, 'error')
  } finally {
    pendingId.value = null
  }
}

async function deleteCode(c) {
  if (!confirm(t.value.confirmDelete(c.label || c.code))) return
  pendingId.value = c.id
  try {
    await api.delete('/admin-code', { data: { id: c.id } })
    codes.value = codes.value.filter((x) => x.id !== c.id)
    if (newlyCreated.value?.id === c.id) newlyCreated.value = null
    showToast(t.value.toastDeleted)
  } catch {
    showToast(t.value.toastDeleteFail, 'error')
  } finally {
    pendingId.value = null
  }
}

function handleLogout() {
  clearAdminToken()
  router.push('/')
}

onMounted(fetchCodes)
</script>

<style scoped>
/* ── 상단 진행 바 ────────────────────────── */
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 999;
  background: transparent;
  pointer-events: none;
}

.progress-bar.active {
  background: linear-gradient(90deg, #6b4fa0, #9b6dcc, #6b4fa0);
  background-size: 200% 100%;
  animation: progress-slide 1.2s linear infinite;
}

@keyframes progress-slide {
  0%   { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}

/* ── 반응형: 테이블/카드 전환 ────────────── */
.code-cards  { display: none; }
.table-wrapper { display: block; }

@media (max-width: 640px) {
  .table-wrapper { display: none; }
  .code-cards    { display: flex; flex-direction: column; gap: 10px; }
}

/* ── 레이아웃 ─────────────────────────────── */
.dashboard {
  min-height: 100vh;
  background: #f4f2f8;
}

.dash-header {
  background: #fff;
  border-bottom: 1px solid #e8e4f0;
  padding: 0 16px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-circle-sm {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #6b4fa0;
  color: #fff;
  font-size: 10px;
  font-style: italic;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-title {
  font-size: 14px;
  font-weight: 600;
  color: #2c2c2c;
}

.lang-select {
  font-size: 12px;
  padding: 4px 6px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  color: #555;
  cursor: pointer;
  outline: none;
}

.lang-select:hover { border-color: #6b4fa0; }

.logout-btn {
  font-size: 12px;
  color: #888;
  background: none;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 5px 10px;
  cursor: pointer;
  white-space: nowrap;
}

.logout-btn:hover { color: #e05050; border-color: #e05050; }

.dash-main {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px 16px;
}

/* ── Stats ───────────────────────────────── */
.stats-row {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 10px;
  padding: 16px 12px;
  flex: 1;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.stat-num {
  font-size: 28px;
  font-weight: 700;
  color: #6b4fa0;
  line-height: 1.1;
}

.stat-card.used .stat-num   { color: #888; }
.stat-card.unused .stat-num { color: #2da86b; }

.stat-label {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}

/* ── Create ──────────────────────────────── */
.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.create-section {
  background: #fff;
  border-radius: 10px;
  padding: 16px 18px;
  margin-bottom: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.create-section .section-title { margin-bottom: 12px; }

.create-form {
  display: flex;
  gap: 8px;
}

.label-input {
  flex: 1;
  padding: 10px 12px;
  border: 1.5px solid #ddd;
  border-radius: 6px;
  font-size: 16px; /* iOS 사파리 자동 줌 방지 */
  outline: none;
  transition: border-color 0.2s;
  min-width: 0;
}

.label-input:focus { border-color: #6b4fa0; }

.create-btn {
  padding: 10px 16px;
  background: #6b4fa0;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  transition: background 0.2s;
  flex-shrink: 0;
}

.create-btn:hover:not(:disabled) { background: #5a3e8a; }
.create-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.new-code-banner {
  margin-top: 12px;
  background: #f0eaf8;
  border: 1.5px solid #c8b2e8;
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.new-code-value {
  font-size: 18px;
  font-weight: 700;
  color: #6b4fa0;
  letter-spacing: 2px;
}

.new-code-label {
  font-size: 13px;
  color: #666;
  flex: 1;
  min-width: 0;
}

.copy-btn {
  padding: 6px 14px;
  background: #6b4fa0;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  flex-shrink: 0;
}

/* ── Table section ───────────────────────── */
.table-section {
  background: #fff;
  border-radius: 10px;
  padding: 16px 18px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
}

.table-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* 필터 탭 */
.filter-tabs {
  display: flex;
  gap: 3px;
  background: #f4f2f8;
  border-radius: 8px;
  padding: 3px;
}

.filter-tab {
  padding: 5px 12px;
  font-size: 12px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #777;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}

.filter-tab.active {
  background: #fff;
  color: #6b4fa0;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* 검색 */
.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  padding: 6px 28px 6px 10px;
  border: 1.5px solid #ddd;
  border-radius: 6px;
  font-size: 16px; /* iOS 사파리 자동 줌 방지: 16px 미만이면 줌인됨 */
  outline: none;
  width: 180px;
  transition: border-color 0.2s;
}

.search-input:focus { border-color: #6b4fa0; }

.search-clear {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  font-size: 11px;
  color: #aaa;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.search-clear:hover { color: #555; }

/* ── 데스크톱 테이블 ─────────────────────── */
.table-wrapper { overflow-x: auto; }

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th {
  text-align: left;
  padding: 9px 12px;
  border-bottom: 2px solid #eee;
  color: #777;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

td {
  padding: 11px 12px;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
  vertical-align: middle;
}

tr:last-child td { border-bottom: none; }
tr.row-new td    { background: #faf5ff; }

.code-cell {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: 700;
  color: #6b4fa0;
  letter-spacing: 1.5px;
}

/* ── 모바일 카드 ──────────────────────────── */
.code-cards { gap: 10px; }

.code-card {
  border: 1px solid #ede9f5;
  border-radius: 10px;
  padding: 14px;
  background: #fdfcff;
}

.code-card.card-new { background: #faf5ff; border-color: #c8b2e8; }

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.card-code {
  font-family: 'Courier New', monospace;
  font-size: 17px;
  font-weight: 700;
  color: #6b4fa0;
  letter-spacing: 2px;
}

.card-label {
  font-size: 14px;
  color: #444;
  margin-bottom: 6px;
}

.card-dates {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
}

.card-actions {
  display: flex;
  gap: 6px;
}

/* ── Badge ───────────────────────────────── */
.badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.badge.used   { background: #f0f0f0; color: #888; }
.badge.unused { background: #e6f7ef; color: #2da86b; }

/* ── Action 버튼 ─────────────────────────── */
.actions-cell {
  display: flex;
  gap: 5px;
  align-items: center;
}

.action-btn {
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.15s;
  white-space: nowrap;
}

.btn-copy    { background: #f0eaf8; color: #6b4fa0; border-color: #d4bff0; }
.btn-copy:hover { background: #e4d8f5; }

.btn-reissue { background: #e8f4fd; color: #2b7fc4; border-color: #b8d9f5; }
.btn-reissue:hover:not(:disabled) { background: #d4eafa; }
.btn-reissue:disabled {
  background: #f5f5f5;
  color: #bbb;
  border-color: #e0e0e0;
  cursor: not-allowed;
}

.btn-delete  { background: #fdf0f0; color: #d94040; border-color: #f5c0c0; }
.btn-delete:hover { background: #fce0e0; }

/* ── 기타 ────────────────────────────────── */
.loading-text,
.empty-text {
  text-align: center;
  padding: 32px;
  color: #aaa;
  font-size: 14px;
}

.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 11px 20px;
  border-radius: 8px;
  font-size: 14px;
  color: #fff;
  background: #333;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  z-index: 100;
  white-space: nowrap;
  max-width: calc(100vw - 32px);
  text-align: center;
}

.toast.error { background: #e05050; }

/* ── 모바일 미디어 쿼리 ──────────────────── */
@media (max-width: 640px) {
  .dash-main { padding: 14px 12px; }

  .stats-row { gap: 8px; margin-bottom: 14px; }

  .stat-card { padding: 12px 8px; }
  .stat-num  { font-size: 22px; }
  .stat-label { font-size: 10px; }

  .create-section,
  .table-section { padding: 14px 14px; border-radius: 8px; }

  .create-form { flex-direction: column; }
  .create-btn  { width: 100%; padding: 11px; }

  .table-header { flex-direction: column; align-items: stretch; }
  .table-controls { flex-direction: column; align-items: stretch; gap: 8px; }

  .filter-tabs { justify-content: stretch; }
  .filter-tab  { flex: 1; text-align: center; }

  .search-wrap  { width: 100%; }
  .search-input { width: 100%; box-sizing: border-box; }

  .card-actions { flex-wrap: wrap; }
  .action-btn   { flex: 1; text-align: center; }
}
</style>
