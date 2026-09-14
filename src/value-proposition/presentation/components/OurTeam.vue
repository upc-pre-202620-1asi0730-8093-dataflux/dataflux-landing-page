<script setup>
import { useI18n } from 'vue-i18n'
import ReferenceArtwork from '../../../shared/presentation/components/ReferenceArtwork.vue'
const { t } = useI18n()
const members = [
  { name: 'Luis Angel Cisneros Salas',       initials: 'LC', photo: 'luis-cisneros' },
  { name: 'Miroslav Oscar Manosalva Tovar',   initials: 'MM', photo: 'miroslav-manosalva' },
  { name: 'Bruno Rodrigo Montalvo Vásquez',   initials: 'BM', photo: 'bruno-montalvo' },
  { name: 'Vargas Manchinelli, Deiby Juan',   initials: 'DV', photo: 'deiby-vargas' },
  { name: 'Marlon Packard Viza Quispe',       initials: 'MV', photo: 'marlon-viza' },
]
const photos = import.meta.glob('/public/assets/images/team/*.{png,jpg,jpeg,webp}', { eager: true, query: '?url', import: 'default' })
function photoUrl(name) {
  const key = Object.keys(photos).find((path) => path.split('/').pop().split('.')[0] === name)
  return key ? `${import.meta.env.BASE_URL}${key.replace('/public/', '')}` : null
}
</script>

<template>
  <section id="our-team" class="team section" aria-labelledby="team-title">
    <div class="container">
      <h2 id="team-title" class="section-heading team__heading">{{ t('team.title') }}</h2>
      <div class="team__grid">
        <article v-for="(member, index) in members" :key="member.photo" class="team-card">
          <div class="team-card__avatar">
            <img v-if="photoUrl(member.photo)" :src="photoUrl(member.photo)" :alt="member.name" loading="lazy">
            <ReferenceArtwork v-else-if="index === 4" src="team-reference.png" :source-width="675"
              :x="455" :y="392" :width="75" :height="75" :alt="member.name" />
            <span v-else :aria-label="t('team.photoPending')" class="team-card__initials">{{ member.initials }}</span>
          </div>
          <h3>{{ member.name }}</h3>
          <p class="team-card__role">{{ t('team.role') }}</p>
          <p class="team-card__bio">{{ t(`team.bios.${index}`) }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
