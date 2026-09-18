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
const avatarInitial = computed(() => {
  const source = props.user.name?.trim() || props.user.email?.trim() || ''
  return source ? source.charAt(0).toUpperCase() : '?'
})

const navIcons = {
  profile: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="7" r="3"/><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6"/></svg>',
  inventory: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3l6.2 3.2v7.6L10 17l-6.2-3.2V6.2L10 3z"/><path d="M3.8 6.2L10 9.4l6.2-3.2"/><path d="M10 9.4V17"/></svg>',
  register: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7"/><path d="M10 7v6M7 10h6"/></svg>',
  requests: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 11L6 4.5h8l2.5 6.5"/><path d="M3.5 11v4a1 1 0 001 1h11a1 1 0 001-1v-4"/><path d="M3.5 11h4l1 2h3l1-2h4"/></svg>',
  activeRentals: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="14" height="12" rx="2"/><path d="M3 8.5h14"/><path d="M7 2.5v3M13 2.5v3"/><path d="M7 12l2 2 4-4.5"/></svg>',
  maintenance: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="10" cy="10" r="3"/><path d="M10 2.5v2.3M10 15.2v2.3M2.5 10h2.3M15.2 10h2.3M4.9 4.9l1.6 1.6M13.5 13.5l1.6 1.6M15.1 4.9l-1.6 1.6M6.5 13.5l-1.6 1.6"/></svg>',
  history: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 6.2A7 7 0 1110.3 17"/><path d="M4.5 3v3.5H8"/><path d="M10 7v3.3l2.3 1.4"/></svg>',
  catalog: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="6" height="6" rx="1.2"/><rect x="11" y="3" width="6" height="6" rx="1.2"/><rect x="3" y="11" width="6" height="6" rx="1.2"/><rect x="11" y="11" width="6" height="6" rx="1.2"/></svg>',
}
const navItems = computed(() => [
  { key: 'profile', label: t('dashboard.tabs.profile') },
  { key: 'inventory', label: t('dashboard.tabs.inventory') },
  { key: 'register', label: t('dashboard.tabs.register') },
  { key: 'requests', label: t('dashboard.tabs.requests') },
  { key: 'activeRentals', label: t('dashboard.tabs.activeRentals') },
  { key: 'maintenance', label: t('dashboard.tabs.maintenance') },
  { key: 'history', label: t('dashboard.tabs.history') },
  { key: 'catalog', label: t('dashboard.tabs.catalog') },
].map(item => ({ ...item, icon: navIcons[item.key] })))

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

const maintenanceRecords = ref([
  { id: 'maint-1', machineId: 'compactor', type: 'maintenance', description: 'Scheduled inspection and hydraulic fluid change.', date: '2026-09-01' },
  { id: 'maint-2', machineId: 'crane', type: 'incident', description: 'Reported abnormal noise in the lifting motor during operation.', date: '2026-09-05' },
])
const maintenanceForm = reactive({ machineId: '', type: 'maintenance', description: '', date: todayIso })
const maintenanceFormError = ref('')
const maintenanceFormSuccess = ref(false)

function registerMaintenance() {
  maintenanceFormSuccess.value = false
  const machineId = maintenanceForm.machineId
  const description = maintenanceForm.description.trim()
  const date = maintenanceForm.date
  if (!machineId) { maintenanceFormError.value = 'machine'; return }
  if (!description) { maintenanceFormError.value = 'description'; return }
  if (!date) { maintenanceFormError.value = 'date'; return }
  maintenanceFormError.value = ''
  maintenanceRecords.value.unshift({ id: `maint-${Date.now()}`, machineId, type: maintenanceForm.type, description, date })
  const item = inventoryItems.value.find(i => i.id === machineId)
  if (item) {
    item.status = 'maintenance'
    item.lastMaintenance = date
  }
  maintenanceForm.machineId = ''
  maintenanceForm.type = 'maintenance'
  maintenanceForm.description = ''
  maintenanceForm.date = todayIso
  maintenanceFormSuccess.value = true
}

const historyFilter = ref('')
const fullHistory = computed(() => {
  const maintenanceEntries = maintenanceRecords.value.map(record => ({
    id: record.id,
    machineId: record.machineId,
    date: record.date,
    badgeClass: record.type === 'incident' ? 'status-badge--rejected' : 'status-badge--maintenance',
    badgeText: t(`dashboard.maintenance.types.${record.type}`),
    detail: record.description,
  }))
  const requestEntries = rentalRequests.value.map(request => ({
    id: request.id,
    machineId: request.machineId,
    date: request.startDate,
    badgeClass: `status-badge--${request.status}`,
    badgeText: t(`dashboard.requests.statuses.${request.status}`),
    detail: t('dashboard.history.requestDetail', { start: request.startDate, end: request.endDate }),
  }))
  return [...maintenanceEntries, ...requestEntries]
    .filter(entry => !historyFilter.value || entry.machineId === historyFilter.value)
    .sort((a, b) => b.date.localeCompare(a.date))
})

function machineCategory(machineId) {
  const item = inventoryItems.value.find(i => i.id === machineId)
  if (!item) return ''
  return item.custom ? item.category : t(`dashboard.inventory.items.${item.id}.category`)
}
const catalogSearch = ref('')
const catalogCategory = ref('')
const catalogStatus = ref('')
const categoryOptions = computed(() => {
  const unique = new Set(inventoryItems.value.map(item => machineCategory(item.id)))
  return Array.from(unique).sort()
})
const filteredCatalog = computed(() => {
  const query = catalogSearch.value.trim().toLowerCase()
  return inventoryItems.value.filter(item => {
    const name = machineName(item.id).toLowerCase()
    const category = machineCategory(item.id)
    const matchesSearch = !query || name.includes(query) || category.toLowerCase().includes(query)
    const matchesCategory = !catalogCategory.value || category === catalogCategory.value
    const matchesStatus = !catalogStatus.value || item.status === catalogStatus.value
    return matchesSearch && matchesCategory && matchesStatus
  })
})
</script>

<template>
  <div class="dashboard-shell">
    <aside class="dashboard-sidebar">
      <div class="dashboard-sidebar__brand">
        <BrandLogo />
      </div>

      <nav class="dashboard-nav" :aria-label="t('dashboard.tabsLabel')">
        <button v-for="tab in navItems" :key="tab.key" type="button" class="dashboard-nav__item"
          :class="{ 'is-active': activeTab === tab.key }" :aria-pressed="activeTab === tab.key" @click="activeTab = tab.key">
          <span class="dashboard-nav__icon" v-html="tab.icon"></span>
          <span class="dashboard-nav__label">{{ tab.label }}</span>
        </button>
      </nav>

      <div class="dashboard-sidebar__footer">
        <div class="dashboard-user">
          <span class="dashboard-user__avatar">{{ avatarInitial }}</span>
          <div class="dashboard-user__info">
            <span class="dashboard-user__name">{{ user.name || displayName || t('dashboard.profile.empty') }}</span>
            <span class="dashboard-user__email">{{ user.email }}</span>
          </div>
        </div>
        <button class="dashboard-logout" type="button" @click="$emit('logout')">{{ t('dashboard.logout') }}</button>
      </div>
    </aside>

    <main class="dashboard-main">
      <header class="dashboard-topbar">
        <h1>{{ t('dashboard.welcome', { name: displayName }) }}</h1>
        <p>{{ t('dashboard.body') }}</p>
      </header>

      <div v-if="activeTab === 'profile'" class="profile-card">
        <h2 class="panel-title">{{ t('dashboard.profileTitle') }}</h2>
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
        <h2 class="panel-title">{{ t('dashboard.inventory.title') }}</h2>
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
        <h2 class="panel-title">{{ t('dashboard.register.title') }}</h2>
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
        <h2 class="panel-title">{{ t('dashboard.requests.title') }}</h2>
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

      <div v-else-if="activeTab === 'activeRentals'" class="active-rentals-card">
        <h2 class="panel-title">{{ t('dashboard.activeRentals.title') }}</h2>
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

      <div v-else-if="activeTab === 'maintenance'" class="maintenance-card">
        <h2 class="panel-title">{{ t('dashboard.maintenance.title') }}</h2>
        <form class="register-form" @submit.prevent="registerMaintenance">
          <div class="register-form__row">
            <label for="maintenance-machine">{{ t('dashboard.maintenance.machine') }}</label>
            <select id="maintenance-machine" v-model="maintenanceForm.machineId" name="machine" required>
              <option value="" disabled>{{ t('dashboard.maintenance.selectMachine') }}</option>
              <option v-for="item in inventoryItems" :key="item.id" :value="item.id">{{ machineName(item.id) }}</option>
            </select>
          </div>
          <div class="register-form__grid register-form__grid--two">
            <div class="register-form__row">
              <label for="maintenance-type">{{ t('dashboard.maintenance.type') }}</label>
              <select id="maintenance-type" v-model="maintenanceForm.type" name="type">
                <option value="maintenance">{{ t('dashboard.maintenance.types.maintenance') }}</option>
                <option value="incident">{{ t('dashboard.maintenance.types.incident') }}</option>
              </select>
            </div>
            <div class="register-form__row">
              <label for="maintenance-date">{{ t('dashboard.maintenance.date') }}</label>
              <input id="maintenance-date" v-model="maintenanceForm.date" type="date" name="date" required>
            </div>
          </div>
          <div class="register-form__row">
            <label for="maintenance-description">{{ t('dashboard.maintenance.description') }}</label>
            <textarea id="maintenance-description" v-model="maintenanceForm.description" name="description" rows="3" required maxlength="300"></textarea>
          </div>
          <button type="submit" class="btn">{{ t('dashboard.maintenance.submit') }}</button>
          <p v-if="maintenanceFormError" class="register-form__status register-form__status--error" role="status">{{ t(`dashboard.maintenance.errors.${maintenanceFormError}`) }}</p>
          <p v-else-if="maintenanceFormSuccess" class="register-form__status register-form__status--success" role="status">{{ t('dashboard.maintenance.success') }}</p>
        </form>

        <h3 class="maintenance-log-title">{{ t('dashboard.maintenance.logTitle') }}</h3>
        <div class="inventory-table-wrap">
          <table class="inventory-table">
            <thead>
              <tr>
                <th scope="col">{{ t('dashboard.maintenance.machine') }}</th>
                <th scope="col">{{ t('dashboard.maintenance.type') }}</th>
                <th scope="col">{{ t('dashboard.maintenance.description') }}</th>
                <th scope="col">{{ t('dashboard.maintenance.date') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in maintenanceRecords" :key="record.id">
                <td>{{ machineName(record.machineId) }}</td>
                <td>
                  <span class="status-badge" :class="record.type === 'incident' ? 'status-badge--rejected' : 'status-badge--maintenance'">{{ t(`dashboard.maintenance.types.${record.type}`) }}</span>
                </td>
                <td class="cell-wrap">{{ record.description }}</td>
                <td>{{ record.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else-if="activeTab === 'history'" class="history-card">
        <h2 class="panel-title">{{ t('dashboard.history.title') }}</h2>
        <div class="history-filter">
          <label for="history-machine-filter">{{ t('dashboard.history.filter') }}</label>
          <select id="history-machine-filter" v-model="historyFilter">
            <option value="">{{ t('dashboard.history.allMachines') }}</option>
            <option v-for="item in inventoryItems" :key="item.id" :value="item.id">{{ machineName(item.id) }}</option>
          </select>
        </div>
        <p v-if="fullHistory.length === 0" class="active-rentals-empty">{{ t('dashboard.history.empty') }}</p>
        <div v-else class="inventory-table-wrap">
          <table class="inventory-table">
            <thead>
              <tr>
                <th scope="col">{{ t('dashboard.history.machine') }}</th>
                <th scope="col">{{ t('dashboard.history.event') }}</th>
                <th scope="col">{{ t('dashboard.history.date') }}</th>
                <th scope="col">{{ t('dashboard.history.detail') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="entry in fullHistory" :key="entry.id">
                <td>{{ machineName(entry.machineId) }}</td>
                <td>
                  <span class="status-badge" :class="entry.badgeClass">{{ entry.badgeText }}</span>
                </td>
                <td>{{ entry.date }}</td>
                <td class="cell-wrap">{{ entry.detail }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="catalog-card">
        <h2 class="panel-title">{{ t('dashboard.catalog.title') }}</h2>
        <div class="catalog-filters">
          <input v-model="catalogSearch" type="search" :placeholder="t('dashboard.catalog.searchPlaceholder')" :aria-label="t('dashboard.catalog.search')">
          <select v-model="catalogCategory" :aria-label="t('dashboard.catalog.allCategories')">
            <option value="">{{ t('dashboard.catalog.allCategories') }}</option>
            <option v-for="cat in categoryOptions" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <select v-model="catalogStatus" :aria-label="t('dashboard.catalog.allStatuses')">
            <option value="">{{ t('dashboard.catalog.allStatuses') }}</option>
            <option value="available">{{ t('dashboard.inventory.statuses.available') }}</option>
            <option value="rented">{{ t('dashboard.inventory.statuses.rented') }}</option>
            <option value="maintenance">{{ t('dashboard.inventory.statuses.maintenance') }}</option>
            <option value="reserved">{{ t('dashboard.inventory.statuses.reserved') }}</option>
          </select>
        </div>
        <p v-if="filteredCatalog.length === 0" class="active-rentals-empty">{{ t('dashboard.catalog.empty') }}</p>
        <div v-else class="catalog-grid">
          <button v-for="item in filteredCatalog" :key="item.id" type="button" class="catalog-item" @click="showMachineDetail(item)">
            <span class="catalog-item__category">{{ machineCategory(item.id) }}</span>
            <h3 class="catalog-item__name">{{ machineName(item.id) }}</h3>
            <span class="status-badge" :class="`status-badge--${item.status}`">{{ t(`dashboard.inventory.statuses.${item.status}`) }}</span>
            <p class="catalog-item__availability">{{ t('dashboard.inventory.detail.availability', { available: item.available, total: item.total }) }}</p>
            <p class="catalog-item__rate">{{ item.rate ? t('dashboard.inventory.detail.rateValue', { rate: item.rate }) : t('dashboard.profile.empty') }}</p>
            <span class="catalog-item__cta">{{ t('dashboard.catalog.viewDetail') }}</span>
          </button>
        </div>
      </div>
    </main>
    <MachineDetailDialog ref="machineDialog" />
  </div>
</template>
