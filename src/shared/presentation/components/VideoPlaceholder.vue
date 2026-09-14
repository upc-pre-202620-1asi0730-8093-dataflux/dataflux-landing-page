<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({ filename: { type: String, required: true }, title: { type: String, required: true } })
const { t } = useI18n()
const failed = ref(false)
const videos = import.meta.glob('/public/assets/videos/*.mp4', { eager: true, query: '?url', import: 'default' })
const available = computed(() => !failed.value && Boolean(videos[`/public/assets/videos/${props.filename}`]))
const videoUrl = computed(() => `${import.meta.env.BASE_URL}assets/videos/${props.filename}`)
</script>

<template>
  <div class="video-frame">
    <video v-if="available" :src="videoUrl" controls preload="metadata" playsinline
      :aria-label="title" @error="failed = true"></video>
    <!-- Placeholder estilo YouTube: fondo negro + botón rojo + línea roja abajo -->
    <div v-else class="video-placeholder" role="img" :aria-label="`${title}. ${t('video.soon')}`">
      <!-- Botón play estilo YouTube -->
      <div class="vp-play-btn" aria-hidden="true">
        <svg viewBox="0 0 68 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Fondo rojo redondeado -->
          <rect x="0" y="0" width="68" height="48" rx="12" fill="#FF0000"/>
          <!-- Triángulo blanco -->
          <polygon points="27,14 27,34 47,24" fill="white"/>
        </svg>
      </div>
      <!-- Línea roja inferior (barra de progreso estilo YouTube) -->
      <span class="vp-status">{{ t('video.soon') }}</span>
      <div class="vp-progress" aria-hidden="true">
        <span class="vp-progress__bar"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-placeholder {
  position: relative;
  width: 100%;
  height: 100%;
  background: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.vp-play-btn {
  width: clamp(68px, 11vw, 168px);
  height: auto;
  opacity: 0.9;
  transition: opacity 0.2s, transform 0.2s;
}
.vp-status { position: absolute; bottom: 12px; color: #cbd5e1; font-size: 12px; }
.vp-play-btn:hover,
.video-frame:hover .vp-play-btn {
  opacity: 1;
  transform: scale(1.08);
}
.vp-play-btn svg {
  width: 100%;
  height: 100%;
}
.vp-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255,255,255,0.15);
}
.vp-progress__bar {
  display: block;
  height: 100%;
  width: 32%;
  background: #FF0000;
  border-radius: 2px;
}
</style>
