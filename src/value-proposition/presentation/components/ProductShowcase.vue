<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import VideoPlaceholder from '../../../shared/presentation/components/VideoPlaceholder.vue'
const { t } = useI18n()
const active = ref(null)
</script>

<template>
  <section id="product-demo" class="showcase section" aria-labelledby="showcase-title">
    <div class="container">
      <h2 id="showcase-title" class="section-heading">{{ t('showcase.title') }}</h2>
      <div class="showcase__grid">
        <!-- TODO: Add /assets/videos/product-demo.mp4. -->
        <VideoPlaceholder filename="product-demo.mp4" :title="t('showcase.video')" />
        <div class="showcase__accordion">
          <div v-for="index in 4" :key="index" class="showcase__item" :class="{ 'is-active': active === index }">
            <h3><button :id="`feature-trigger-${index}`" :aria-expanded="active === index"
              :aria-controls="`feature-panel-${index}`" @click="active = active === index ? null : index">
              {{ t(`showcase.items.${index - 1}.title`) }}
            </button></h3>
            <div v-show="active === index" :id="`feature-panel-${index}`" role="region" :aria-labelledby="`feature-trigger-${index}`">
              <p>{{ t(`showcase.items.${index - 1}.body`) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
