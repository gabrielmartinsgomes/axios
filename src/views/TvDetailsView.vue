<script setup>
import { defineProps, onMounted } from 'vue';
import { useTVStore } from '@/stores/tv'; // Criar uma nova store
const tvStore = useTVStore();

const props = defineProps({
  tvId: {
    type: Number,
    required: true,
  },
});

onMounted(async () => {
  console.log('ID do programa de TV:', props.tvId); // Certifique-se de que o ID está correto
  await tvStore.getTVDetail(props.tvId);
  console.log('Dados do programa de TV:', tvStore.currentTV); // Veja os dados recebidos
});

</script>

<template>
  <div class="main">
    <div class="content">
      <img
        :src="`https://image.tmdb.org/t/p/w185${tvStore.currentTV.poster_path}`"
        :alt="tvStore.currentTV.name"
      />

      <div class="details">
        <h1>Programa: {{ tvStore.currentTV.name }}</h1>
        <p>{{ tvStore.currentTV.tagline }}</p>
        <p>{{ tvStore.currentTV.overview }}</p>
        <p>Avaliação: {{ tvStore.currentTV.vote_average }}</p>
        <p>Primeiro episódio: {{ tvStore.currentTV.first_air_date }}</p>
      </div>
    </div>
  </div>

  <p>Produtoras</p>
  <div class="companies">
    <template
      v-for="company in tvStore.currentTV.production_companies"
      :key="company.id"
    >
      <img
        v-if="company.logo_path"
        :src="`https://image.tmdb.org/t/p/w92${company.logo_path}`"
        :alt="company.name"
      />
      <p v-else>{{ company.name }}</p>
    </template>
  </div>
</template>

<style scoped>
  .companies {
    display: flex;
    flex-direction: row;
    column-gap: 3rem;
    align-items: center;
    margin-bottom: 2rem;
  }
</style>
