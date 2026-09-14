<script setup>
import { computed } from 'vue'

// Preserve the supplied image bytes. Only the illustration is framed with CSS;
// all headings, copy and interactive controls are real HTML in their sections.
const props = defineProps({
  src: { type: String, required: true },
  sourceWidth: { type: Number, required: true },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  alt: { type: String, default: '' },
  eager: Boolean,
  directory: { type: String, default: 'images/references' },
})
const frameStyle = computed(() => ({ aspectRatio: `${props.width} / ${props.height}` }))
const imageStyle = computed(() => ({
  width: `${props.sourceWidth / props.width * 100}%`,
  left: `${-props.x / props.width * 100}%`,
  top: `${-props.y / props.height * 100}%`,
}))
const baseUrl = import.meta.env.BASE_URL
</script>

<template>
  <span class="reference-artwork" :style="frameStyle">
    <img :src="`${baseUrl}assets/${directory}/${src}`" :alt="alt" :style="imageStyle"
      :loading="eager ? 'eager' : 'lazy'" decoding="async" draggable="false">
  </span>
</template>
