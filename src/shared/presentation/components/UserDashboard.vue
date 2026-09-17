<script setup>
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BrandLogo from './BrandLogo.vue'

const props = defineProps({ user: { type: Object, required: true } })
defineEmits(['logout'])
const { t } = useI18n()
const activeTab = ref('profile')
const inventoryItems = ref([
  { id: 'excavator', status: 'available', available: 3, total: 5, custom: false },
  { id: 'crane', status: 'rented', available: 0, total: 2, custom: false },
  { id: 'compactor', status: 'maintenance', available: 1, total: 3, custom: false },
  { id: 'generator', status: 'available', available: 4, total: 4, custom: false },
  { id: 'loader', status: 'reserved', available: 0, total: 1, custom: false },
  { id: 'mixer', status: 'available', available: 2, total: 2, custom: false },
])
const displayName = computed(() => {
  const raw = props.user.name?.trim().split(' ')[0] || props.user.email?.split('@')[0] || ''
  return raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : ''
})

const machineForm = reactive({ name: '', category: '', status: 'available', total: 1, available: 1 })
const machineFormError = ref('')
const machineFormSuccess = ref(false)

function registerMachine() {
  machineFormSuccess.value = false
  const name = machineForm.name.trim()
  const category = machineForm.category.trim()
  const total = Number(machineForm.total)
  const available = Number(machineForm.available)
  if (!name || !category) { machineFormError.value = 'fields'; return }
  if (!Number.isFinite(total) || total < 1) { machineFormError.value = 'total'; return }
  if (!Number.isFinite(available) || available < 0 || available > total) { machineFormError.value = 'available'; return }
  machineFormError.value = ''
  inventoryItems.value.push({
    id: `custom-${Date.now()}`,
    name,
    category,
    status: machineForm.status,
    available,
    total,
    custom: true,
  })
  machineForm.name = ''
  machineForm.category = ''
  machineForm.status = 'available'
  machineForm.total = 1
  machineForm.available = 1
  machineFormSuccess.value = true
}
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
        <button type="button" :aria-pressed="activeTab === 'register'"
          :class="{ 'is-active': activeTab === 'register' }" @click="activeTab = 'register'">{{ t('dashboard.tabs.register') }}</button>
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

      <div v-else-if="activeTab === 'inventory'" class="inventory-card">
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
                <td>{{ item.custom ? item.name : t(`dashboard.inventory.items.${item.id}.name`) }}</td>
                <td>{{ item.custom ? item.category : t(`dashboard.inventory.items.${item.id}.category`) }}</td>
                <td>
                  <span class="status-badge" :class="`status-badge--${item.status}`">{{ t(`dashboard.inventory.statuses.${item.status}`) }}</span>
                </td>
                <td>{{ item.available }} / {{ item.total }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="register-card">
        <h2>{{ t('dashboard.register.title') }}</h2>
        <form class="register-form" @submit.prevent="registerMachine">
          <div class="register-form__row">
            <label for="machine-name">{{ t('dashboard.register.name') }}</label>
            <input id="machine-name" v-model="machineForm.name" type="text" name="name" required maxlength="80">
          </div>
          <div class="register-form__row">
            <label for="machine-category">{{ t('dashboard.register.category') }}</label>
            <input id="machine-category" v-model="machineForm.category" type="text" name="category" required maxlength="60">
          </div>
          <div class="register-form__grid">
            <div class="register-form__row">
              <label for="machine-status">{{ t('dashboard.register.status') }}</label>
              <select id="machine-status" v-model="machineForm.status" name="status">
                <option value="available">{{ t('dashboard.inventory.statuses.available') }}</option>
                <option value="rented">{{ t('dashboard.inventory.statuses.rented') }}</option>
                <option value="maintenance">{{ t('dashboard.inventory.statuses.maintenance') }}</option>
                <option value="reserved">{{ t('dashboard.inventory.statuses.reserved') }}</option>
              </select>
            </div>
            <div class="register-form__row">
              <label for="machine-total">{{ t('dashboard.register.total') }}</label>
              <input id="machine-total" v-model.number="machineForm.total" type="number" name="total" min="1" max="999" required>
            </div>
            <div class="register-form__row">
              <label for="machine-available">{{ t('dashboard.register.available') }}</label>
              <input id="machine-available" v-model.number="machineForm.available" type="number" name="available" min="0" max="999" required>
            </div>
          </div>
          <button type="submit" class="btn">{{ t('dashboard.register.submit') }}</button>
          <p v-if="machineFormError" class="register-form__status register-form__status--error" role="status">{{ t(`dashboard.register.errors.${machineFormError}`) }}</p>
          <p v-else-if="machineFormSuccess" class="register-form__status register-form__status--success" role="status">{{ t('dashboard.register.success') }}</p>
        </form>
      </div>

      <button class="btn" type="button" @click="$emit('logout')">{{ t('dashboard.logout') }}</button>
    </div>
  </div>
</template>
