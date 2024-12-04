<script setup>
import { defineProps, onMounted } from 'vue';
import { useMovieStore } from '@/stores/movie';
const movieStore = useMovieStore();

const props = defineProps({
  movieId: {
    type: Number,
    required: true,
  },
});

onMounted(async () => {
  await movieStore.getMovieDetail(props.movieId);
  const trailer = await movieStore.getMovieTrailer(props.movieId);
  movieStore.currentMovie.trailer = trailer.data.results[0] || null;  // Armazenar o primeiro trailer, caso exista
});
</script>

<template>
  <div class="main">
    <div class="content">
      <img
        :src="`https://image.tmdb.org/t/p/w780${movieStore.currentMovie.poster_path}`"
        :alt="movieStore.currentMovie.title"
      />

      <div class="details">
        <h1>Filme: {{ movieStore.currentMovie.title }}</h1>
        <p>{{ movieStore.currentMovie.tagline }}</p>
        <p>{{ movieStore.currentMovie.overview }}</p>
        <p>Orçamento: ${{ movieStore.currentMovie.budget }}</p>
        <p>Avaliação: {{ movieStore.currentMovie.vote_average }}</p>
        <!-- Exibir trailer -->
        <div v-if="movieStore.currentMovie.trailer">
          <h2>Trailer:</h2>
          <iframe
            :src="`https://www.youtube.com/embed/${movieStore.currentMovie.trailer.key}`"
            width="560"
            height="315"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>

    <div class="companies">
      <template v-for="company in movieStore.currentMovie.production_companies" :key="company.id">
        <img
          v-if="company.logo_path"
          :src="`https://image.tmdb.org/t/p/w500${company.logo_path}`"
          :alt="company.name"
          class="company-logo"
        />
        <p v-else>{{ company.name }}</p>
      </template>
    </div>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #121212;
  color: #f4f4f4;
  min-height: 100vh;
}

.content {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 2rem;
  max-width: 1400px;
  width: 100%;
}

.content img {
  width: 50%;
  height: auto;
  border-radius: 1rem;
  object-fit: cover;
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.8);
}

.details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  padding: 2rem;
}

.details h1 {
  font-size: 3rem;
  color: #ffcc00;
  margin: 0;
}

.details p {
  font-size: 1.5rem;
  line-height: 2rem;
  color: #f4f4f4;
}

.trailer-link {
  text-decoration: none;
}

.trailer-button {
  background-color: #ffcc00;
  color: #121212;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.trailer-button:hover {
  background-color: #e6b800;
}

.companies {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 3rem;
  padding: 2rem;
  background-color: #121212;
  border-radius: 1rem;
  width: 100%;
}

.companies img {
  width: 150px;
  height: auto;
  border-radius: 0.5rem;
  box-shadow: 0 0 1rem rgba(255, 255, 255, 0.2);
}

.companies p {
  font-size: 1.5rem;
  color: #ffcc00;
  text-align: center;
}

/* Responsividade */
@media (max-width: 768px) {
  .content {
    flex-direction: column;
    align-items: center;
  }

  .content img {
    width: 100%;
    height: auto;
  }

  .details {
    padding: 1rem;
  }

  .details h1 {
    font-size: 2.5rem;
  }

  .details p {
    font-size: 1.3rem;
  }

  .companies img {
    width: 100px;
  }
}

@media (max-width: 480px) {
  .content img {
    width: 100%;
    height: auto;
  }

  .details h1 {
    font-size: 2rem;
  }

  .details p {
    font-size: 1.2rem;
  }
}
</style>
