<script setup>
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';
import Loading from 'vue-loading-overlay';
import { useGenreStore } from '@/stores/genre';
import { useRouter } from 'vue-router'


const movies = ref([]);
const isLoading = ref(false);
const formatDate = (date) => new Date(date).toLocaleDateString('pt-BR');
const genreStore = useGenreStore();
const router = useRouter()

defineProps({
  searchResults: Object
});


onMounted(async () => {
  isLoading.value = true;
  await genreStore.getAllGenres('movie');
  isLoading.value = false;
});

const listMovies = async (genreId) => {
  genreStore.setCurrentGenreId(genreId);
  isLoading.value = true;
  const response = await api.get('discover/movie', {
    params: {
      with_genres: genreId,
      language: 'pt-BR',
    },
  });
  movies.value = response.data.results;
  isLoading.value = false;
};

function openMovie(movieId) {
  router.push({ name: 'MovieDetails', params: { movieId } });
}

</script>

<template>
  <div class="page">
    <div v-if="searchResults.movies.length > 0" class="movie-view">
      <h1>Filmes - Resultados da Pesquisa</h1>
      <div class="results">
        <div v-for="movie in searchResults.movies" :key="movie.id">
          <h3>{{ movie.title }}</h3>
          <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" alt="Imagem do filme" />
        </div>
      </div>
    </div>
    <div v-else>
      <p>Nenhum filme encontrado.</p>
    </div>
    <h1>Filmes</h1>
    <ul class="genre-list">
      <li v-for="genre in genreStore.genres" :key="genre.id" @click="listMovies(genre.id)" class="genre-item"
        :class="{ active: genre.id === genreStore.currentGenreId }">
        {{ genre.name }}
      </li>
    </ul>
    <loading v-model:active="isLoading" is-full-page />
    <div class="item-list">
      <div v-for="movie in movies" :key="movie.id" class="card" @click="openMovie(movie.id)">
        <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" />
        <div class="details">
          <p class="card-title">{{ movie.title }}</p>
          <p class="card-date">{{ formatDate(movie.release_date) }}</p>
          <p class="card-genres">
            <span v-for="genre_id in movie.genre_ids" :key="genre_id" @click.stop="listMovies(genre_id)">
              {{ genreStore.getGenreName(genre_id) }}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
/* Estilo Baseado no CSS da HomeView */
.page {
  padding: 2rem;
  background-color: #121212;
  /* Mesma cor de fundo da Home */
  color: #f4f4f4;
}

.movie-view {
  padding: 2rem;
}

.results {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.results div {
  width: 200px;
  text-align: center;
}

.results img {
  width: 100%;
  border-radius: 0.5rem;
}
.genre-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  list-style: none;
  margin-bottom: 2rem;
}

.genre-item {
  background-color: #387250;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.genre-item:hover {
  background-color: #4e9e5f;
  box-shadow: 0 0 0.5rem #387250;
}

.genre-item.active {
  background-color: #67b086;
  font-weight: bold;
}

.item-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}

.card {
  width: 15rem;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  /* Altere para um sombreamento similar à Home */
  background-color: #1e1e1e;
  color: #fff;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

.card img {
  width: 100%;
  height: 22rem;
  object-fit: contain;
  /* Mesma lógica da Home */
  border-radius: 0.5rem;
}

.card .details {
  padding: 1rem;
}

.card-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.card-date {
  font-size: 0.9rem;
  color: #aaa;
}

.card-genres span {
  background-color: #748708;
  border-radius: 0.5rem;
  padding: 0.2rem 0.5rem;
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
  margin-right: 0.5rem;
  cursor: pointer;
}

.card-genres span:hover {
  background-color: #5b6b08;
}

/* Indicadores de Páginas (se necessário) */
.indicators {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.indicators span {
  width: 1rem;
  height: 1rem;
  margin: 0 0.5rem;
  background-color: #444;
  border-radius: 50%;
  cursor: pointer;
}

.indicators span.active {
  background-color: #ffcc00;
}

/* Responsividade */
@media (max-width: 768px) {
  .card {
    width: 12rem;
  }

  .card img {
    height: 18rem;
  }

  .card .details {
    padding: 0.8rem;
  }

  .card-title {
    font-size: 1rem;
  }

  .card-date {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .card {
    width: 10rem;
  }

  .card img {
    height: 15rem;
  }

  .card-title {
    font-size: 0.9rem;
  }

  .card-date {
    font-size: 0.7rem;
  }
}
</style>
