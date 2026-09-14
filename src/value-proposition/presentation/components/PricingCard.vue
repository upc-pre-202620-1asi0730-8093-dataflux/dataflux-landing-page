<script setup>
import { useI18n } from 'vue-i18n'
defineProps({ plan: { type: String, required: true }, featured: Boolean, period: { type: String, required: true } })
defineEmits(['select'])
const { t } = useI18n()
</script>

<template>
  <article class="pricing-card" :class="{ 'pricing-card--featured': featured }">
    <header class="pricing-card__header">
      <h3>{{ t(`pricing.${plan}.name`) }}</h3>
      <p>{{ t(`pricing.${plan}.body`) }}</p>
    </header>
    <div class="pricing-card__details">
      <span v-if="featured" class="pricing-card__badge">{{ t('pricing.popular') }}</span>
      <ul class="check-list">
        <li v-for="index in 5" :key="index"><span class="check-mark" aria-hidden="true">✓</span>{{ t(`pricing.${plan}.features.${index - 1}`) }}</li>
      </ul>
      <button class="btn" :class="{ 'btn--white': !featured }" @click="$emit('select', { plan: t(`pricing.${plan}.name`), period })">
        {{ t(`pricing.${plan}.cta`) }}
      </button>
    </div>
  </article>
</template>
