<script setup>
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';

const genres = ref([]);
const tvShows = ref([]);

onMounted(async () => {
  const response = await api.get('genre/tv/list?language=pt-BR');
  genres.value = response.data.genres;
});

const listTVShows = async (genreId) => {
  const response = await api.get('discover/tv', {
    params: {
      with_genres: genreId,
      language: 'pt-BR'
    }
  });
  tvShows.value = response.data.results;
};
</script>

<template>
  <h1>Programas de TV</h1>
  <ul class="genre-list">
    <li v-for="genre in genres" :key="genre.id" @click="listTVShows(genre.id)" class="genre-item">
      {{ genre.name }}
    </li>
  </ul>

  <div class="tv-show-list">
    <div v-for="show in tvShows" :key="show.id" class="tv-show-card">
      <img :src="`https://image.tmdb.org/t/p/w500${show.poster_path}`" :alt="show.name" />
      <div class="tv-show-details">
        <p class="tv-show-title">{{ show.name }}</p>
        <p class="tv-show-original-title">{{ show.original_name }}</p>
        <p class="tv-show-release-date">{{ show.first_air_date }}</p>
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
  padding: 0;
}

.genre-item {
  background-color: #5d6424;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  align-self: center;
  color: #fff;
  display: flex;
  justify-content: center;
}

.genre-item:hover {
  cursor: pointer;
  background-color: #7d8a2e;
  box-shadow: 0 0 0.5rem #5d6424;
}

.tv-show-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.tv-show-card {
  width: 15rem;
  height: 30rem;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 0 0.5rem #000;
}

.tv-show-card img {
  width: 100%;
  height: 20rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 0.5rem #000;
}

.tv-show-details {
  padding: 0 0.5rem;
}

.tv-show-title {
  font-size: 1.1rem;
  font-weight: bold;
  line-height: 1.3rem;
  height: 3.2rem;
}
</style>