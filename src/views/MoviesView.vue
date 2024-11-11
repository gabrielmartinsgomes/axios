<script setup>
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';

const genres = ref([]);
const movies = ref([]);
const errorMessage = ref('');

onMounted(async () => {
  try {
    const response = await api.get('genre/movie/list?language=pt-BR');
    genres.value = response.data.genres;
  } catch (error) {
    console.error("Erro ao buscar gêneros de filmes:", error);
    errorMessage.value = 'Não foi possível carregar os gêneros de filmes.';
  }
});

const listMovies = async (genreId) => {
  try {
    const response = await api.get('discover/movie', {
      params: {
        with_genres: genreId,
        language: 'pt-BR'
      }
    });
    movies.value = response.data.results;
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    errorMessage.value = 'Não foi possível carregar os filmes para este gênero.';
  }
};
</script>

<template>
  <h1>Filmes</h1>
  <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  <ul class="genre-list">
    <li v-for="genre in genres" :key="genre.id" @click="listMovies(genre.id)" class="genre-item">
      {{ genre.name }}
    </li>
  </ul>

  <div class="movie-list">
    <div v-for="movie in movies" :key="movie.id" class="movie-card">
      <img v-if="movie.poster_path" :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" />
      <div class="movie-details">
        <p class="movie-title">{{ movie.title }}</p>
        <p class="movie-original-title">{{ movie.original_title }}</p>
        <p class="movie-release-date">{{ movie.release_date }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.genre-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  list-style: none;
  margin-bottom: 2rem;
}

.genre-item {
  background-color: #387250;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  color: #fff;
}

.genre-item:hover {
  cursor: pointer;
  background-color: #4e9e5f;
  box-shadow: 0 0 0.5rem #387250;
}

.movie-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.movie-card {
  width: 15rem;
  height: 30rem;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 0 0.5rem #000;
}

.movie-card img {
  width: 100%;
  height: 20rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 0.5rem #000;
}

.movie-details {
  padding: 0 0.5rem;
}

.movie-title {
  font-size: 1.1rem;
  font-weight: bold;
  line-height: 1.3rem;
  height: 3.2rem;
}

.error-message {
  color: red;
  text-align: center;
  margin-bottom: 1rem;
}
</style>
