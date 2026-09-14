<script setup>
import { useI18n } from 'vue-i18n'
import VideoPlaceholder from '../../../shared/presentation/components/VideoPlaceholder.vue'
const { t } = useI18n()
</script>

<template>
  <section id="about" class="about section" aria-labelledby="about-title">
    <div class="container">
      <h2 id="about-title"><span>RentBuild:</span> {{ t('about.title') }}</h2>
      <div class="about__grid">
        <div>
          <p class="about__intro">{{ t('about.body') }}</p>
          <ul class="about__list"><li v-for="index in 3" :key="index"><strong>{{ t(`about.items.${index - 1}.title`) }}</strong> {{ t(`about.items.${index - 1}.body`) }}</li></ul>
        </div>
        <!-- TODO: Add /assets/videos/about-rentbuild.mp4. -->
        <VideoPlaceholder filename="about-rentbuild.mp4" :title="t('about.video')" />
      </div>
    </div>
  </section>
</template>
