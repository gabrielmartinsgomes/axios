<script setup>
import { ref, onMounted } from 'vue';
import { useGenreStore } from '@/stores/genre';
import { useRouter } from 'vue-router';
import api from '@/plugins/axios';

const tvShows = ref([]);
const genreStore = useGenreStore();
const router = useRouter();

onMounted(async () => {
  await genreStore.getAllGenres('tv');
});

const listTVShows = async (genreId) => {
  const response = await api.get('discover/tv', {
    params: {
      with_genres: genreId,
      language: 'pt-BR',
    },
  });
  tvShows.value = response.data.results;
};


function openTVShow(tvId) {
  router.push({ name: 'TVDetails', params: { tvId } }); // Certifique-se de que o parâmetro está sendo enviado
}

</script>

<template>
  <h1>Programas de TV</h1>

  <ul class="genre-list">
    <li
      v-for="genre in genreStore.genres"
      :key="genre.id"
      @click="listTVShows(genre.id)"
      class="genre-item"
    >
      {{ genre.name }}
    </li>
  </ul>

  <div class="tv-show-list">
    <div v-for="show in tvShows" :key="show.id" class="tv-show-card">
      <img
        :src="`https://image.tmdb.org/t/p/w500${show.poster_path}`"
        :alt="show.name"
        @click="openTVShow(show.id)" 
      />
      <div class="tv-show-details">
        <p class="tv-show-title">{{ show.name }}</p>
        <p class="tv-show-original-title">{{ show.original_name }}</p>
        <p class="tv-show-release-date">{{ show.first_air_date }}</p>

        <p class="tv-show-genres">
          <span
            v-for="genre_id in show.genre_ids"
            :key="genre_id"
            @click="listTVShows(genre_id)"
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

.tv-show-genres {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 0.2rem;
}

.tv-show-genres span {
  background-color: #748708;
  border-radius: 0.5rem;
  padding: 0.2rem 0.5rem;
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
}

.tv-show-genres span:hover {
  cursor: pointer;
  background-color: #455a08;
  box-shadow: 0 0 0.5rem #748708;
}
</style>
