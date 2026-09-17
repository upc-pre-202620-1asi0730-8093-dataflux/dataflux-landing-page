<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const dialog = ref(null)
const item = ref(null)
let previousFocus

const name = computed(() => {
  if (!item.value) return ''
  return item.value.custom ? item.value.name : t(`dashboard.inventory.items.${item.value.id}.name`)
})
const category = computed(() => {
  if (!item.value) return ''
  return item.value.custom ? item.value.category : t(`dashboard.inventory.items.${item.value.id}.category`)
})
const description = computed(() => {
  if (!item.value) return ''
  return item.value.custom ? item.value.description : t(`dashboard.inventory.items.${item.value.id}.description`)
})
const location = computed(() => {
  if (!item.value) return ''
  return item.value.custom ? item.value.location : t(`dashboard.inventory.items.${item.value.id}.location`)
})

function open(value) {
  item.value = value
  previousFocus = document.activeElement
  dialog.value.showModal()
  document.body.classList.add('dialog-open')
}
function close() { dialog.value.close() }
function onClose() {
  document.body.classList.remove('dialog-open')
  previousFocus?.focus()
}
defineExpose({ open })
</script>

<template>
  <dialog ref="dialog" class="access-dialog machine-dialog" aria-labelledby="machine-title"
    @close="onClose" @click="event => { if (event.target === dialog) close() }">
    <button class="access-dialog__close" :aria-label="t('dashboard.inventory.detail.close')" @click="close">×</button>
    <template v-if="item">
      <span class="eyebrow">{{ category }}</span>
      <h2 id="machine-title">{{ name }}</h2>
      <div class="machine-dialog__status">
        <span class="status-badge" :class="`status-badge--${item.status}`">{{ t(`dashboard.inventory.statuses.${item.status}`) }}</span>
        <span class="machine-dialog__availability">{{ t('dashboard.inventory.detail.availability', { available: item.available, total: item.total }) }}</span>
      </div>
      <p class="machine-dialog__description">{{ description || t('dashboard.profile.empty') }}</p>
      <dl class="machine-dialog__grid">
        <div class="machine-dialog__field">
          <dt>{{ t('dashboard.inventory.detail.location') }}</dt>
          <dd>{{ location || t('dashboard.profile.empty') }}</dd>
        </div>
        <div class="machine-dialog__field">
          <dt>{{ t('dashboard.inventory.detail.code') }}</dt>
          <dd>{{ item.code || t('dashboard.profile.empty') }}</dd>
        </div>
        <div class="machine-dialog__field">
          <dt>{{ t('dashboard.inventory.detail.rate') }}</dt>
          <dd>{{ item.rate ? t('dashboard.inventory.detail.rateValue', { rate: item.rate }) : t('dashboard.profile.empty') }}</dd>
        </div>
        <div class="machine-dialog__field">
          <dt>{{ t('dashboard.inventory.detail.lastMaintenance') }}</dt>
          <dd>{{ item.lastMaintenance || t('dashboard.profile.empty') }}</dd>
        </div>
      </dl>
    </template>
  </dialog>
</template>
