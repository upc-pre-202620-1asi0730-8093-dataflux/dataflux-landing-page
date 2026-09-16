<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BrandLogo from './BrandLogo.vue'

const props = defineProps({ user: { type: Object, required: true } })
defineEmits(['logout'])
const { t } = useI18n()
const displayName = computed(() => {
  const raw = props.user.name?.trim().split(' ')[0] || props.user.email?.split('@')[0] || ''
  return raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : ''
})
</script>

<template>
  <div class="dashboard-home">
    <div class="dashboard-home__card">
      <BrandLogo />
      <span class="eyebrow">RENTBUILD</span>
      <h1>{{ t('dashboard.welcome', { name: displayName }) }}</h1>
      <p>{{ t('dashboard.body') }}</p>
      <button class="btn" type="button" @click="$emit('logout')">{{ t('dashboard.logout') }}</button>
    </div>
  </div>
</template>
