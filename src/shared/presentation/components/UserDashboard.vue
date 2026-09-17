<script setup>
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BrandLogo from './BrandLogo.vue'
import MachineDetailDialog from './MachineDetailDialog.vue'

const props = defineProps({ user: { type: Object, required: true } })
defineEmits(['logout'])
const { t } = useI18n()
const activeTab = ref('profile')
const machineDialog = ref(null)
const inventoryItems = ref([
  { id: 'excavator', status: 'available', available: 3, total: 5, custom: false, code: 'EXC-1001', rate: 180, lastMaintenance: '2026-08-02' },
  { id: 'crane', status: 'rented', available: 0, total: 2, custom: false, code: 'CRN-2010', rate: 420, lastMaintenance: '2026-07-20' },
  { id: 'compactor', status: 'maintenance', available: 1, total: 3, custom: false, code: 'CMP-3005', rate: 90, lastMaintenance: '2026-09-01' },
  { id: 'generator', status: 'available', available: 4, total: 4, custom: false, code: 'GEN-4002', rate: 60, lastMaintenance: '2026-06-15' },
  { id: 'loader', status: 'reserved', available: 0, total: 1, custom: false, code: 'LDR-5001', rate: 150, lastMaintenance: '2026-05-30' },
  { id: 'mixer', status: 'available', available: 2, total: 2, custom: false, code: 'MIX-6003', rate: 75, lastMaintenance: '2026-08-10' },
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

function showMachineDetail(item) {
  machineDialog.value.open(item)
}

const rentalRequests = ref([
  { id: 'req-1', machineId: 'excavator', startDate: '2026-09-20', endDate: '2026-09-27', status: 'pending' },
  { id: 'req-2', machineId: 'compactor', startDate: '2026-09-18', endDate: '2026-09-22', status: 'approved' },
  { id: 'req-3', machineId: 'crane', startDate: '2026-09-25', endDate: '2026-10-05', status: 'pending' },
  { id: 'req-4', machineId: 'generator', startDate: '2026-09-15', endDate: '2026-09-19', status: 'rejected' },
  { id: 'req-5', machineId: 'loader', startDate: '2026-09-10', endDate: '2026-09-18', status: 'approved' },
])

function machineName(machineId) {
  const item = inventoryItems.value.find(i => i.id === machineId)
  if (!item) return machineId
  return item.custom ? item.name : t(`dashboard.inventory.items.${item.id}.name`)
}

function daysBetween(fromIso, toIso) {
  return Math.round((new Date(toIso) - new Date(fromIso)) / 86400000)
}
const todayIso = new Date().toISOString().slice(0, 10)
const activeRentals = computed(() => rentalRequests.value
  .filter(request => request.status === 'approved' && request.endDate >= todayIso)
  .map(request => {
    const item = inventoryItems.value.find(i => i.id === request.machineId)
    const rate = item?.rate ?? null
    const totalDays = daysBetween(request.startDate, request.endDate) + 1
    const cost = rate !== null ? rate * totalDays : null
    const inProgress = request.startDate <= todayIso
    const daysRemaining = inProgress ? daysBetween(todayIso, request.endDate) : daysBetween(todayIso, request.startDate)
    return { id: request.id, machineId: request.machineId, startDate: request.startDate, endDate: request.endDate, rate, cost, inProgress, daysRemaining }
  }))
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
        <button type="button" :aria-pressed="activeTab === 'requests'"
          :class="{ 'is-active': activeTab === 'requests' }" @click="activeTab = 'requests'">{{ t('dashboard.tabs.requests') }}</button>
        <button type="button" :aria-pressed="activeTab === 'activeRentals'"
          :class="{ 'is-active': activeTab === 'activeRentals' }" @click="activeTab = 'activeRentals'">{{ t('dashboard.tabs.activeRentals') }}</button>
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
              <tr v-for="item in inventoryItems" :key="item.id" class="inventory-table__row" tabindex="0" role="button"
                :aria-label="t('dashboard.inventory.viewDetail')" @click="showMachineDetail(item)"
                @keydown.enter="showMachineDetail(item)" @keydown.space.prevent="showMachineDetail(item)">
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

      <div v-else-if="activeTab === 'register'" class="register-card">
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

      <div v-else-if="activeTab === 'requests'" class="requests-card">
        <h2>{{ t('dashboard.requests.title') }}</h2>
        <div class="inventory-table-wrap">
          <table class="inventory-table">
            <thead>
              <tr>
                <th scope="col">{{ t('dashboard.requests.machine') }}</th>
                <th scope="col">{{ t('dashboard.requests.dates') }}</th>
                <th scope="col">{{ t('dashboard.requests.status') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in rentalRequests" :key="request.id">
                <td>{{ machineName(request.machineId) }}</td>
                <td>{{ t('dashboard.requests.dateRange', { start: request.startDate, end: request.endDate }) }}</td>
                <td>
                  <span class="status-badge" :class="`status-badge--${request.status}`">{{ t(`dashboard.requests.statuses.${request.status}`) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="active-rentals-card">
        <h2>{{ t('dashboard.activeRentals.title') }}</h2>
        <p v-if="activeRentals.length === 0" class="active-rentals-empty">{{ t('dashboard.activeRentals.empty') }}</p>
        <div v-else class="inventory-table-wrap">
          <table class="inventory-table">
            <thead>
              <tr>
                <th scope="col">{{ t('dashboard.activeRentals.machine') }}</th>
                <th scope="col">{{ t('dashboard.activeRentals.period') }}</th>
                <th scope="col">{{ t('dashboard.activeRentals.rate') }}</th>
                <th scope="col">{{ t('dashboard.activeRentals.cost') }}</th>
                <th scope="col">{{ t('dashboard.activeRentals.status') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rental in activeRentals" :key="rental.id">
                <td>{{ machineName(rental.machineId) }}</td>
                <td>{{ t('dashboard.requests.dateRange', { start: rental.startDate, end: rental.endDate }) }}</td>
                <td>{{ rental.rate !== null ? t('dashboard.inventory.detail.rateValue', { rate: rental.rate }) : t('dashboard.profile.empty') }}</td>
                <td>{{ rental.cost !== null ? t('dashboard.activeRentals.costValue', { cost: rental.cost }) : t('dashboard.profile.empty') }}</td>
                <td>
                  <span class="status-badge" :class="rental.inProgress ? 'status-badge--approved' : 'status-badge--pending'">
                    {{ rental.inProgress ? t('dashboard.activeRentals.inProgress', { days: rental.daysRemaining }) : t('dashboard.activeRentals.upcoming', { days: rental.daysRemaining }) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <button class="btn" type="button" @click="$emit('logout')">{{ t('dashboard.logout') }}</button>
    </div>
    <MachineDetailDialog ref="machineDialog" />
  </div>
</template>
