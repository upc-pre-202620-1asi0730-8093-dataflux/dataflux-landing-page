<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BrandLogo from './BrandLogo.vue'

const props = defineProps({ user: { type: Object, required: true } })
defineEmits(['logout'])
const { t } = useI18n()
const activeTab = ref('profile')
const inventoryItems = [
  { id: 'excavator', status: 'available', available: 3, total: 5 },
  { id: 'crane', status: 'rented', available: 0, total: 2 },
  { id: 'compactor', status: 'maintenance', available: 1, total: 3 },
  { id: 'generator', status: 'available', available: 4, total: 4 },
  { id: 'loader', status: 'reserved', available: 0, total: 1 },
  { id: 'mixer', status: 'available', available: 2, total: 2 },
]
const displayName = computed(() => {
  const raw = props.user.name?.trim().split(' ')[0] || props.user.email?.split('@')[0] || ''
  return raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : ''
})
</script>

<template>
  <div class="dashboard-home">
    <div class="dashboard-home__card">
      <BrandLogo />
      <span class="eyebrow">RENTBUILD</span>
      <h1>{{ t('dashboard.welcome', { name: displayName }) }}</h1>
      <p>{{ t('dashboard.body') }}</p>

      <div class="dashboard-tabs" role="group" :aria-label="t('dashboard.tabsLabel')">
        <button type="button" :aria-pressed="activeTab === 'profile'"
          :class="{ 'is-active': activeTab === 'profile' }" @click="activeTab = 'profile'">{{ t('dashboard.tabs.profile') }}</button>
        <button type="button" :aria-pressed="activeTab === 'inventory'"
          :class="{ 'is-active': activeTab === 'inventory' }" @click="activeTab = 'inventory'">{{ t('dashboard.tabs.inventory') }}</button>
      </div>

      <div v-if="activeTab === 'profile'" class="profile-card">
        <h2>{{ t('dashboard.profileTitle') }}</h2>
        <dl class="profile-info">
          <div class="profile-info__row">
            <dt>{{ t('dashboard.profile.name') }}</dt>
            <dd>{{ user.name || t('dashboard.profile.empty') }}</dd>
          </div>
          <div class="profile-info__row">
            <dt>{{ t('dashboard.profile.email') }}</dt>
            <dd>{{ user.email || t('dashboard.profile.empty') }}</dd>
          </div>
          <div class="profile-info__row">
            <dt>{{ t('dashboard.profile.company') }}</dt>
            <dd>{{ user.company || t('dashboard.profile.empty') }}</dd>
          </div>
          <div class="profile-info__row">
            <dt>{{ t('dashboard.profile.phone') }}</dt>
            <dd>{{ user.phone || t('dashboard.profile.empty') }}</dd>
          </div>
        </dl>
      </div>

      <div v-else class="inventory-card">
        <h2>{{ t('dashboard.inventory.title') }}</h2>
        <div class="inventory-table-wrap">
          <table class="inventory-table">
            <thead>
              <tr>
                <th scope="col">{{ t('dashboard.inventory.equipment') }}</th>
                <th scope="col">{{ t('dashboard.inventory.category') }}</th>
                <th scope="col">{{ t('dashboard.inventory.status') }}</th>
                <th scope="col">{{ t('dashboard.inventory.units') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in inventoryItems" :key="item.id">
                <td>{{ t(`dashboard.inventory.items.${item.id}.name`) }}</td>
                <td>{{ t(`dashboard.inventory.items.${item.id}.category`) }}</td>
                <td>
                  <span class="status-badge" :class="`status-badge--${item.status}`">{{ t(`dashboard.inventory.statuses.${item.status}`) }}</span>
                </td>
                <td>{{ item.available }} / {{ item.total }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <button class="btn" type="button" @click="$emit('logout')">{{ t('dashboard.logout') }}</button>
    </div>
  </div>
</template>
