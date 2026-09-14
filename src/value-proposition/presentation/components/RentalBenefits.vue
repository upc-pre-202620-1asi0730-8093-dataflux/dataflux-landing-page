<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const baseUrl = import.meta.env.BASE_URL
</script>

<template>
  <section id="benefits" class="benefits section" aria-labelledby="benefits-title">
    <div class="container benefits__grid">
      <div>
        <h2 id="benefits-title">{{ t('benefits.title') }}</h2>
        <ul class="check-list benefits__list">
          <li v-for="index in 5" :key="index"><span class="check-mark" aria-hidden="true">✓</span>{{ t(`benefits.items.${index - 1}`) }}</li>
        </ul>
      </div>
      <div class="benefits__visual">
        <img :src="`${baseUrl}assets/images/benefits-visual.png`" :alt="t('benefits.art')" width="1024" height="819" loading="lazy">
        <div class="benefits__return floating-card"><span class="return-check" aria-hidden="true">✓</span>{{ t('art.returnRecorded') }}</div>
      </div>
    </div>
  </section>
</template>
