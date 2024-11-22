<script setup>
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';
import Loading from 'vue-loading-overlay';
import { useGenreStore } from '@/stores/genre';
import { useRouter } from 'vue-router'


const movies = ref([]);
const errorMessage = ref('');
const isLoading = ref(false);
const formatDate = (date) => new Date(date).toLocaleDateString('pt-BR');
const genreStore = useGenreStore();
const router = useRouter()


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
  <h1>Filmes</h1>
  <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  <ul class="genre-list">
    <li
    v-for="genre in genreStore.genres" :key="genre.id" @click="listMovies(genre.id)" class="genre-item" :class="{ active: genre.id === genreStore.currentGenreId }"
  >
  
    {{ genre.name }}
  
  </li>
  </ul>
  <loading v-model:active="isLoading" is-full-page />

  <div class="movie-list">
  <div v-for="movie in movies" :key="movie.id" class="movie-card">
    
    <img
  :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
  :alt="movie.title"
  @click="openMovie(movie.id)"
/>
    <div class="movie-details">
      <p class="movie-title">{{ movie.title }}</p>
      <p class="movie-release-date">{{ formatDate(movie.release_date) }}</p>
      <p class="movie-genres">
        <span
  v-for="genre_id in movie.genre_ids"
  :key="genre_id"
  @click="listMovies(genre_id)"
  :class="{ active: genre_id === genreStore.currentGenreId }"
>
   {{ genreStore.getGenreName(genre_id) }} 
</span>
</p>
    </div>
    
  </div>
</div>

</template>

<style scoped>
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

.movie-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}

.movie-card {
  width: 15rem;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 0 0.5rem #000;
  background-color: #1e1e1e;
  color: #fff;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-card img {
  width: 100%;
  height: 22rem;
  object-fit: cover;
}

.movie-details {
  padding: 1rem;
}

.movie-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.movie-release-date {
  font-size: 0.9rem;
  color: #aaa;
}

.movie-genres span {
  background-color: #748708;
  border-radius: 0.5rem;
  padding: 0.2rem 0.5rem;
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
  margin-right: 0.5rem;
  cursor: pointer;
}

.movie-genres span:hover {
  background-color: #5b6b08;
}

/* Responsividade */
@media (max-width: 768px) {
  .movie-card {
    width: 12rem;
  }

  .movie-details {
    padding: 0.8rem;
  }

  .movie-title {
    font-size: 1rem;
  }

  .movie-release-date {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .movie-card {
    width: 10rem;
  }

  .movie-title {
    font-size: 0.9rem;
  }

  .movie-release-date {
    font-size: 0.7rem;
  }
}
</style>


