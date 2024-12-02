<script setup>
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios'; // Certifique-se de que está configurado
import { useRoute } from 'vue-router';

const route = useRoute();
const actorId = route.params.actorId;

const actorDetails = ref(null);
const knownForMovies = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');

onMounted(async () => {
  try {
    isLoading.value = true;

    // Buscar informações do ator
    const response = await api.get(`person/${actorId}`, {
      params: { language: 'pt-BR' },
    });
    actorDetails.value = response.data;

    // Buscar filmes conhecidos do ator
    const creditsResponse = await api.get(`person/${actorId}/movie_credits`, {
      params: { language: 'pt-BR' },
    });
    knownForMovies.value = creditsResponse.data.cast;
  } catch (errorMessage) {
    errorMessage.value = 'Erro ao carregar os detalhes do ator.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="actor-details" v-if="!isLoading">
    <!-- Exibir erro -->
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <!-- Detalhes do ator -->
    <div v-if="actorDetails">
      <div class="actor-header">
        <img
          :src="`https://image.tmdb.org/t/p/w500${actorDetails.profile_path}`"
          :alt="actorDetails.name"
          class="actor-photo"
        />
        <div class="actor-info">
          <h1>{{ actorDetails.name }}</h1>
          <p><strong>Data de nascimento:</strong> {{ actorDetails.birthday || 'Desconhecida' }}</p>
          <p><strong>Local de nascimento:</strong> {{ actorDetails.place_of_birth || 'Desconhecido' }}</p>
          <p v-if="actorDetails.deathday"><strong>Data de falecimento:</strong> {{ actorDetails.deathday }}</p>
          <p class="biography"><strong>Biografia:</strong> {{ actorDetails.biography || 'Nenhuma biografia disponível.' }}</p>
        </div>
      </div>

      <!-- Filmes conhecidos -->
      <section v-if="knownForMovies.length" class="known-for">
        <h2>🎬 Filmes Conhecidos</h2>
        <div class="movie-list">
          <div
            v-for="movie in knownForMovies"
            :key="movie.id"
            class="movie-card"
            @click="$router.push({ name: 'MovieDetails', params: { movieId: movie.id } })"
          >
            <img
              :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
              :alt="movie.title"
            />
            <p class="movie-title">{{ movie.title }}</p>
            <p class="movie-date">{{ new Date(movie.release_date).toLocaleDateString('pt-BR') }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>

  <!-- Loading -->
  <loading v-if="isLoading" is-full-page />

</template>

<style scoped>
.actor-details {
  padding: 2rem;
  background-color: #121212;
  color: #f4f4f4;
}

.actor-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.actor-photo {
  width: 300px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.actor-info {
  flex: 1;
}

.actor-info h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #ffcc00;
}

.actor-info p {
  font-size: 1.2rem;
  margin: 0.5rem 0;
}

.biography {
  margin-top: 1rem;
}

.known-for {
  margin-top: 3rem;
}

.known-for h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #ffcc00;
}

.movie-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.movie-card {
  width: 15rem;
  text-align: center;
  background-color: #1e1e1e;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-card img {
  width: 100%;
  height: 20rem;
  object-fit: cover;
  border-bottom: 2px solid #ffcc00;
}

.movie-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0.5rem 0;
  color: #f4f4f4;
}

.movie-date {
  font-size: 0.9rem;
  color: #aaa;
}
</style>
