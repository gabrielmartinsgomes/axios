<script setup>
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';
import Loading from 'vue-loading-overlay';
import { useGenreStore } from '@/stores/genre';
import { useRouter } from 'vue-router';

const tvShows = ref([]);
const errorMessage = ref('');
const isLoading = ref(false);
const formatDate = (date) => new Date(date).toLocaleDateString('pt-BR');
const genreStore = useGenreStore();
const router = useRouter();

onMounted(async () => {
  isLoading.value = true;
  try {
    await genreStore.getAllGenres('tv');
  } catch (error) {
    errorMessage.value = 'Erro ao carregar os gêneros de TV.';
  } finally {
    isLoading.value = false;
  }
});

const listTVShows = async (genreId) => {
  genreStore.setCurrentGenreId(genreId);
  isLoading.value = true;
  try {
    const response = await api.get('discover/tv', {
      params: {
        with_genres: genreId,
        language: 'pt-BR',
      },
    });
    tvShows.value = response.data.results;
  } catch (error) {
    errorMessage.value = 'Erro ao carregar os programas de TV.';
  } finally {
    isLoading.value = false;
  }
};

function openTVShow(tvId) {
  router.push({ name: 'TVDetails', params: { tvId } });
}
</script>

<template>
  <h1>Programas de TV</h1>
  <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  <ul class="genre-list">
    <li
      v-for="genre in genreStore.genres"
      :key="genre.id"
      @click="listTVShows(genre.id)"
      class="genre-item"
      :class="{ active: genre.id === genreStore.currentGenreId }"
    >
      {{ genre.name }}
    </li>
  </ul>
  <loading v-model:active="isLoading" is-full-page />

  <div class="tv-show-list">
    <div v-for="show in tvShows" :key="show.id" class="tv-show-card">
      <img
        :src="`https://image.tmdb.org/t/p/w500${show.poster_path}`"
        :alt="show.name"
        @click="openTVShow(show.id)"
      />
      <div class="tv-show-details">
        <p class="tv-show-title">{{ show.name }}</p>
        <p class="tv-show-release-date">{{ formatDate(show.first_air_date) }}</p>
        <p class="tv-show-genres">
          <span
            v-for="genre_id in show.genre_ids"
            :key="genre_id"
            @click="listTVShows(genre_id)"
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

.tv-show-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}

.tv-show-card {
  width: 15rem;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 0 0.5rem #000;
  background-color: #1e1e1e;
  color: #fff;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.tv-show-card:hover {
  transform: scale(1.05);
}

.tv-show-card img {
  width: 100%;
  height: 22rem;
  object-fit: cover;
}

.tv-show-details {
  padding: 1rem;
}

.tv-show-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.tv-show-release-date {
  font-size: 0.9rem;
  color: #aaa;
}

.tv-show-genres span {
  background-color: #748708;
  border-radius: 0.5rem;
  padding: 0.2rem 0.5rem;
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
  margin-right: 0.5rem;
  cursor: pointer;
}

.tv-show-genres span:hover {
  background-color: #5b6b08;
}

/* Responsividade */
@media (max-width: 768px) {
  .tv-show-card {
    width: 12rem;
  }

  .tv-show-details {
    padding: 0.8rem;
  }

  .tv-show-title {
    font-size: 1rem;
  }

  .tv-show-release-date {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .tv-show-card {
    width: 10rem;
  }

  .tv-show-title {
    font-size: 0.9rem;
  }

  .tv-show-release-date {
    font-size: 0.7rem;
  }
}
</style>
