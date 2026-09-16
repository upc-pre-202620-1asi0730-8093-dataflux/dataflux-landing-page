<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['authenticated'])
const { t } = useI18n()
const dialog = ref(null)
const detail = ref({})
let previousFocus
const loginEndpoint = import.meta.env.VITE_LOGIN_ENDPOINT
const signupEndpoint = import.meta.env.VITE_SIGNUP_ENDPOINT
const loginForm = reactive({ email: '', password: '' })
const loginStatus = ref('')
const loginSubmitting = ref(false)
const signupForm = reactive({ name: '', email: '', password: '' })
const signupStatus = ref('')
const signupSubmitting = ref(false)
const isLogin = computed(() => detail.value.mode === 'login')
const isSignup = computed(() => detail.value.mode !== 'legal' && !isLogin.value)
const title = computed(() => detail.value.mode === 'legal' ? t('access.legalTitle') : isLogin.value ? t('login.title') : t('signup.title'))

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
  signupForm.name = ''
  signupForm.email = ''
  signupForm.password = ''
  signupStatus.value = ''
}
function switchToSignup() {
  close()
  open({})
}
function switchToLogin() {
  close()
  open({ mode: 'login' })
}
async function postJson(endpoint, payload) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)
  try {
    const response = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), signal: controller.signal,
    })
    return response.ok
  } catch { return false }
  finally { clearTimeout(timeout) }
}
function enterDashboard(user) {
  emit('authenticated', user)
  close()
}
async function submitLogin() {
  if (loginSubmitting.value) return
  loginStatus.value = ''
  loginSubmitting.value = true
  const ok = loginEndpoint ? await postJson(loginEndpoint, { ...loginForm }) : true
  loginSubmitting.value = false
  if (!ok) { loginStatus.value = 'error'; return }
  enterDashboard({ email: loginForm.email })
}
async function submitSignup() {
  if (signupSubmitting.value) return
  signupStatus.value = ''
  signupSubmitting.value = true
  const payload = { ...signupForm, plan: detail.value.plan, period: detail.value.period }
  const ok = signupEndpoint ? await postJson(signupEndpoint, payload) : true
  signupSubmitting.value = false
  if (!ok) { signupStatus.value = 'error'; return }
  enterDashboard({ name: signupForm.name, email: signupForm.email })
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
    <p id="access-description">{{ t(isLogin ? 'login.body' : isSignup ? 'signup.body' : 'access.legalBody') }}</p>
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
    <form v-else-if="isSignup" class="login-form" @submit.prevent="submitSignup">
      <div class="login-form__row">
        <label for="signup-name">{{ t('signup.name') }}</label>
        <input id="signup-name" v-model="signupForm.name" type="text" name="name" autocomplete="name" required
          maxlength="120" :disabled="signupSubmitting">
      </div>
      <div class="login-form__row">
        <label for="signup-email">{{ t('signup.email') }}</label>
        <input id="signup-email" v-model="signupForm.email" type="email" name="email" autocomplete="email" required
          maxlength="254" :disabled="signupSubmitting">
      </div>
      <div class="login-form__row">
        <label for="signup-password">{{ t('signup.password') }}</label>
        <input id="signup-password" v-model="signupForm.password" type="password" name="new-password"
          autocomplete="new-password" required minlength="6" maxlength="128" :disabled="signupSubmitting">
      </div>
      <button type="submit" class="btn" :disabled="signupSubmitting">{{ signupSubmitting ? t('signup.submitting') : t('signup.submit') }}</button>
      <p class="login-form__status" role="status">{{ signupStatus ? t(`signup.${signupStatus}`) : '' }}</p>
      <p class="login-form__signup">{{ t('signup.hasAccount') }} <button type="button" @click="switchToLogin">{{ t('signup.login') }}</button></p>
    </form>
    <button v-else class="btn" @click="close">{{ t('access.understood') }}</button>
  </dialog>
</template>
