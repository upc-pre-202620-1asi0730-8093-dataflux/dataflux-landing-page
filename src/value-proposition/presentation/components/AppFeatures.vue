<script setup>
import { useI18n } from 'vue-i18n'
import ReferenceArtwork from '../../../shared/presentation/components/ReferenceArtwork.vue'
const { t } = useI18n()
const panels = [0, 354, 708]
</script>

<template>
  <section id="features" class="features section" aria-labelledby="features-title">
    <div class="container">
      <header class="features__header">
        <h2 id="features-title">{{ t('features.title') }}</h2>
        <p class="section-copy">{{ t('features.body') }}</p>
      </header>
      <div class="features__grid">
        <article v-for="(x, index) in panels" :key="x" class="feature-card">
          <ReferenceArtwork class="feature-card__illustration" src="features-panels.png" directory="images"
            :source-width="1024" :x="x" :width="316" :height="374" />
          <h3>{{ t(`features.items.${index}.title`) }}</h3>
          <p>{{ t(`features.items.${index}.body`) }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
