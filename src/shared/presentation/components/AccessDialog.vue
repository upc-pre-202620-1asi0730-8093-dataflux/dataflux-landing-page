<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const dialog = ref(null)
const detail = ref({})
let previousFocus
const contact = import.meta.env.VITE_CONTACT_EMAIL
const loginEndpoint = import.meta.env.VITE_LOGIN_ENDPOINT
const loginForm = reactive({ email: '', password: '' })
const loginStatus = ref('')
const loginSubmitting = ref(false)
const isLogin = computed(() => detail.value.mode === 'login')
const title = computed(() => detail.value.mode === 'legal' ? t('access.legalTitle') : isLogin.value ? t('login.title') : t('access.title'))
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
  loginForm.email = ''
  loginForm.password = ''
  loginStatus.value = ''
}
function switchToSignup() {
  close()
  open({})
}
async function submitLogin() {
  if (loginSubmitting.value) return
  loginStatus.value = ''
  if (!loginEndpoint) { loginStatus.value = 'unavailable'; return }
  loginSubmitting.value = true
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)
  try {
    const response = await fetch(loginEndpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...loginForm }), signal: controller.signal,
    })
    if (!response.ok) throw new Error('Login was not accepted')
    loginStatus.value = 'success'
  } catch { loginStatus.value = 'error' }
  finally { clearTimeout(timeout); loginSubmitting.value = false }
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
    <p id="access-description">{{ t(isLogin ? 'login.body' : detail.mode === 'legal' ? 'access.legalBody' : 'access.body') }}</p>
    <form v-if="isLogin" class="login-form" @submit.prevent="submitLogin">
      <div class="login-form__row">
        <label for="login-email">{{ t('login.email') }}</label>
        <input id="login-email" v-model="loginForm.email" type="email" name="email" autocomplete="email" required
          maxlength="254" :disabled="loginSubmitting">
      </div>
      <div class="login-form__row">
        <label for="login-password">{{ t('login.password') }}</label>
        <input id="login-password" v-model="loginForm.password" type="password" name="password"
          autocomplete="current-password" required minlength="6" maxlength="128" :disabled="loginSubmitting">
      </div>
      <button type="submit" class="btn" :disabled="loginSubmitting">{{ loginSubmitting ? t('login.submitting') : t('login.submit') }}</button>
      <p class="login-form__status" role="status">{{ loginStatus ? t(`login.${loginStatus}`) : '' }}</p>
      <p class="login-form__signup">{{ t('login.noAccount') }} <button type="button" @click="switchToSignup">{{ t('login.signup') }}</button></p>
    </form>
    <template v-else>
      <a v-if="contact && detail.mode !== 'legal'" class="btn" :href="emailUrl">{{ t('access.contact') }}</a>
      <button v-else class="btn" @click="close">{{ t('access.understood') }}</button>
    </template>
  </dialog>
</template>
