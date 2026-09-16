<script setup>
import { ref } from 'vue'
import TheHeader from './shared/presentation/components/TheHeader.vue'
import SiteFooter from './shared/presentation/components/SiteFooter.vue'
import AccessDialog from './shared/presentation/components/AccessDialog.vue'
import UserDashboard from './shared/presentation/components/UserDashboard.vue'
import TheHero from './value-proposition/presentation/components/TheHero.vue'
import OperationOverview from './value-proposition/presentation/components/OperationOverview.vue'
import AppFeatures from './value-proposition/presentation/components/AppFeatures.vue'
import RentalBenefits from './value-proposition/presentation/components/RentalBenefits.vue'
import ProductShowcase from './value-proposition/presentation/components/ProductShowcase.vue'
import PricingPlans from './value-proposition/presentation/components/PricingPlans.vue'
import ContactUs from './value-proposition/presentation/components/ContactUs.vue'
import OurTeam from './value-proposition/presentation/components/OurTeam.vue'
import AboutRentBuild from './value-proposition/presentation/components/AboutRentBuild.vue'

const SESSION_KEY = 'rentbuild-user'
const accessDialog = ref(null)
const authUser = ref(readStoredUser())

function readStoredUser() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}
function openAccess(detail = {}) {
  accessDialog.value.open(detail)
}
function handleAuthenticated(user) {
  authUser.value = user
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(user)) } catch { /* Optional persistence. */ }
}
function logout() {
  authUser.value = null
  try { sessionStorage.removeItem(SESSION_KEY) } catch { /* Optional persistence. */ }
}
</script>

<template>
  <UserDashboard v-if="authUser" :user="authUser" @logout="logout" />
  <div v-else class="landing-page">
    <TheHeader @access="openAccess" />
    <main id="main-content">
      <TheHero @access="openAccess" />
      <OperationOverview />
      <AppFeatures />
      <RentalBenefits />
      <ProductShowcase />
      <OurTeam />
      <AboutRentBuild />
      <PricingPlans @access="openAccess" />
      <ContactUs />
    </main>
    <SiteFooter @access="openAccess" />
    <AccessDialog ref="accessDialog" @authenticated="handleAuthenticated" />
  </div>
</template>
