<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const dialog = ref(null)
const detail = ref({})
let previousFocus
const contact = import.meta.env.VITE_CONTACT_EMAIL
const title = computed(() => detail.value.mode === 'legal' ? t('access.legalTitle') : t('access.title'))
const emailUrl = computed(() => `mailto:${contact}?subject=${encodeURIComponent(`RentBuild — ${detail.value.plan || 'Access'}`)}`)

function open(value = {}) {
  detail.value = value
  const url = value.mode === 'login' ? import.meta.env.VITE_LOGIN_URL
    : value.mode === 'legal' ? (value.document === 'terms' ? import.meta.env.VITE_TERMS_URL : import.meta.env.VITE_PRIVACY_URL)
      : import.meta.env.VITE_SIGNUP_URL
  if (url && /^https?:\/\//i.test(url)) {
    window.location.assign(url)
    return
  }
  previousFocus = document.activeElement
  dialog.value.showModal()
  document.body.classList.add('dialog-open')
}
function close() { dialog.value.close() }
function onClose() {
  document.body.classList.remove('dialog-open')
  previousFocus?.focus()
}
defineExpose({ open })
</script>

<template>
  <dialog ref="dialog" class="access-dialog" aria-labelledby="access-title" aria-describedby="access-description"
    @close="onClose" @click="event => { if (event.target === dialog) close() }">
    <button class="access-dialog__close" :aria-label="t('access.close')" @click="close">×</button>
    <span class="eyebrow">RENTBUILD</span>
    <h2 id="access-title">{{ title }}</h2>
    <p v-if="detail.plan" class="access-dialog__plan">{{ t('access.selected') }}: {{ detail.plan }} · {{ t(`pricing.${detail.period || 'monthly'}`) }}</p>
    <p id="access-description">{{ t(detail.mode === 'legal' ? 'access.legalBody' : 'access.body') }}</p>
    <a v-if="contact && detail.mode !== 'legal'" class="btn" :href="emailUrl">{{ t('access.contact') }}</a>
    <button v-else class="btn" @click="close">{{ t('access.understood') }}</button>
  </dialog>
</template>
