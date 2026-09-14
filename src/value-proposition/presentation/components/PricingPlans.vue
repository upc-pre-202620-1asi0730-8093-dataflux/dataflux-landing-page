<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PricingCard from './PricingCard.vue'
defineEmits(['access'])
const { t } = useI18n()
const period = ref('annual')
</script>

<template>
  <section id="plans" class="pricing section" aria-labelledby="pricing-title">
    <div class="container">
      <header class="pricing__header">
        <h2 id="pricing-title">{{ t('pricing.title') }}</h2>
        <p class="section-copy">{{ t('pricing.body') }}</p>
        <div class="billing-switch" role="group" :aria-label="t('pricing.billing')">
          <button v-for="value in ['monthly', 'annual']" :key="value" :aria-pressed="period === value"
            :class="{ 'is-active': period === value }" @click="period = value">{{ t(`pricing.${value}`) }}</button>
        </div>
      </header>
      <div class="pricing__grid">
        <PricingCard v-for="plan in ['basic', 'pro', 'premium']" :key="plan" :plan="plan" :featured="plan === 'pro'"
          :period="period" @select="$emit('access', $event)" />
      </div>
      <p class="pricing__period" aria-live="polite">{{ t(`pricing.${period}Note`) }}</p>
    </div>
  </section>
</template>
