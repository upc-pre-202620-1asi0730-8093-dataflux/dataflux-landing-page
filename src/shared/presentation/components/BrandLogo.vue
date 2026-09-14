<script setup>
const props = defineProps({ light: Boolean })
const baseUrl = import.meta.env.BASE_URL
</script>

<template>
  <span class="brand" :class="{ 'brand--light': light }" aria-label="RentBuild">
    <!-- Remove the flat gray export background at render time, preserving the supplied logo. -->
    <svg v-if="light" width="0" height="0" aria-hidden="true" focusable="false" style="position: absolute">
      <defs><filter id="rentbuild-light-logo" color-interpolation-filters="sRGB">
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  20 -16 6 0 -8.5" />
      </filter></defs>
    </svg>
    <img
      class="brand__mark"
      :src="`${baseUrl}assets/images/${light ? 'logo-light' : 'logo-dark'}.png`"
      alt=""
      aria-hidden="true"
      width="57"
      height="57"
      draggable="false"
    />
    <span class="brand__word" aria-hidden="true">entBuild</span>
  </span>
</template>
