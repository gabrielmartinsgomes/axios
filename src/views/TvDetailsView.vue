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
        :src="`https://image.tmdb.org/t/p/w500${tvStore.currentTV.poster_path}`"
        :alt="tvStore.currentTV.name"
        class="tv-poster"
      />

      <div class="details">
        <h1>Programa: {{ tvStore.currentTV.name }}</h1>
        <p>{{ tvStore.currentTV.tagline }}</p>
        <p>{{ tvStore.currentTV.overview }}</p>
        <p>Avaliação: {{ tvStore.currentTV.vote_average }}</p>
        <p>Primeiro episódio: {{ tvStore.currentTV.first_air_date }}</p>
      </div>
    </div>

    <p>Produtoras</p>
    <div class="companies">
      <template v-for="company in tvStore.currentTV.production_companies" :key="company.id">
        <img
          v-if="company.logo_path"
          :src="`https://image.tmdb.org/t/p/w500${company.logo_path}`" 
          :alt="company.name"
          class="company-logo" />
        <p v-else>{{ company.name }}</p>
      </template>
    </div>
  </div>
</template>

<style scoped>
.main {
  background-color: #212121;
  color: #fff;
}

.content {
  display: flex;
  padding: 2rem;
}

.tv-poster {
  width: 30%;
  height: auto;
  margin-right: 2rem;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.6);
}

.details {
  flex: 1;
}

.details h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.details p {
  font-size: 1rem;
  line-height: 1.5;
}

.companies {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  padding: 2rem;
}

.companies img {
  width: 120px;
  height: auto;
  border-radius: 0.5rem;
}

.companies p {
  font-size: 1rem;
  color: #ffcc00;
  text-align: center;
}

/* Responsividade */
@media (max-width: 768px) {
  .content {
    flex-direction: column;
    align-items: center;
  }

  .tv-poster {
    width: 50%;
  }

  .details {
    padding: 1rem;
  }

  .details h1 {
    font-size: 1.5rem;
  }

  .details p {
    font-size: 1.1rem;
  }

  .companies img {
    width: 100px;
  }
}

@media (max-width: 480px) {
  .tv-poster {
    width: 100%;
  }

  .details h1 {
    font-size: 1.3rem;
  }

  .details p {
    font-size: 1rem;
  }
}
</style>
