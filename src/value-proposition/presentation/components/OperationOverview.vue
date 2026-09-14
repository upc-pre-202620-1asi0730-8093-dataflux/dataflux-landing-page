<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const icons = ['ϟ', '◷', '⌘']
</script>

<template>
  <section id="how-it-works" class="operation section" aria-labelledby="operation-title">
    <div class="container operation__grid">
      <div>
        <h2 id="operation-title">{{ t('operation.title') }}</h2>
        <p class="section-copy">{{ t('operation.body') }}</p>
        <div class="operation__ratings">
          <div v-for="index in 2" :key="index">
            <div class="stars" aria-hidden="true">{{ index === 1 ? '★★★★★' : '★★★★' }}<span v-if="index === 2">★</span></div>
            <strong>{{ t(`operation.ratings.${index - 1}.title`) }}</strong>
            <span>{{ t(`operation.ratings.${index - 1}.label`) }}</span>
          </div>
        </div>
      </div>
      <ul class="operation__items">
        <li v-for="(icon, index) in icons" :key="index">
          <span class="operation__icon" aria-hidden="true">{{ icon }}</span>
          <div><h3>{{ t(`operation.items.${index}.title`) }}</h3><p>{{ t(`operation.items.${index}.body`) }}</p></div>
        </li>
      </ul>
    </div>
  </section>
</template>
