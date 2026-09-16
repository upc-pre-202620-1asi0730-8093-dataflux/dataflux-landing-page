<script setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const baseUrl = import.meta.env.BASE_URL
const contact = import.meta.env.VITE_CONTACT_EMAIL
const endpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT
const form = reactive({ name: '', email: '', message: '' })
const status = ref('')
const submitting = ref(false)
const socials = [
  { name: 'GitHub', icon: 'github-icon', href: import.meta.env.VITE_SOCIAL_GITHUB },
  { name: 'X', icon: 'x-icon', href: import.meta.env.VITE_SOCIAL_X },
  { name: 'Discord', icon: 'discord-icon', href: import.meta.env.VITE_SOCIAL_DISCORD },
  { name: 'Bluesky', icon: 'bluesky-icon', href: import.meta.env.VITE_SOCIAL_BLUESKY },
].filter((network) => network.href)

async function submit() {
  if (submitting.value) return
  status.value = ''
  if (!endpoint) { status.value = 'unavailable'; return }
  submitting.value = true
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)
  try {
    const response = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form }), signal: controller.signal,
    })
    if (!response.ok) throw new Error('Message was not accepted')
    status.value = 'success'
    form.name = ''
    form.email = ''
    form.message = ''
  } catch { status.value = 'error' }
  finally { clearTimeout(timeout); submitting.value = false }
}
</script>

<template>
  <section id="contact" class="contact section" aria-labelledby="contact-title">
    <div class="container contact__grid">
      <div class="contact__intro">
        <h2 id="contact-title">{{ t('contact.title') }}</h2>
        <p class="section-copy">{{ t('contact.body') }}</p>
        <a v-if="contact" :href="`mailto:${contact}`" class="contact__email">{{ contact }}</a>
        <div v-if="socials.length" class="contact-social" role="group" :aria-label="t('contact.social')">
          <a v-for="network in socials" :key="network.name" :href="network.href" class="contact-social__link"
            target="_blank" rel="noopener noreferrer" :aria-label="network.name">
            <svg aria-hidden="true"><use :href="`${baseUrl}icons.svg#${network.icon}`" /></svg>
          </a>
        </div>
      </div>
      <form class="contact-form" @submit.prevent="submit">
        <div class="contact-form__row">
          <label for="contact-name">{{ t('contact.name') }}</label>
          <input id="contact-name" v-model="form.name" type="text" name="name" autocomplete="name" required
            maxlength="120" :disabled="submitting">
        </div>
        <div class="contact-form__row">
          <label for="contact-email">{{ t('contact.email') }}</label>
          <input id="contact-email" v-model="form.email" type="email" name="email" autocomplete="email" required
            maxlength="254" :disabled="submitting">
        </div>
        <div class="contact-form__row">
          <label for="contact-message">{{ t('contact.message') }}</label>
          <textarea id="contact-message" v-model="form.message" name="message" rows="5" required maxlength="2000"
            :disabled="submitting"></textarea>
        </div>
        <button type="submit" class="btn" :disabled="submitting">{{ submitting ? t('contact.sending') : t('contact.send') }}</button>
        <p class="contact-form__status" role="status">{{ status ? t(`contact.${status}`) : '' }}</p>
      </form>
    </div>
  </section>
</template>
