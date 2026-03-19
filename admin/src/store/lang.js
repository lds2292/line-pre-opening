import { ref, computed } from 'vue'
import { messages } from '../i18n/index.js'

const _lang = ref(localStorage.getItem('admin_lang') || 'ko')

export const lang = _lang

export function setLang(l) {
  _lang.value = l
  localStorage.setItem('admin_lang', l)
}

export const t = computed(() => messages[_lang.value])
