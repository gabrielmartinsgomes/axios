<script setup>
import { ref, onMounted } from "vue";
import api from "@/plugins/axios";
import { useRouter } from "vue-router";

// Dados para os carrosséis
const nowPlayingMovies = ref([]);
const trendingTVShows = ref([]);
const popularActors = ref([]);
const trendingTrailers = ref([]); // Trailers mais populares
const activeTrailerBackground = ref(""); // Imagem de fundo do trailer ativo

const router = useRouter();
defineProps({
  searchResults: Object
});

// Funções para buscar dados
const fetchNowPlayingMovies = async () => {
  const response = await api.get("movie/now_playing", { params: { language: "pt-BR" } });
  nowPlayingMovies.value = response.data.results;
};

const fetchTrendingTVShows = async () => {
  const response = await api.get("tv/popular", { params: { language: "pt-BR" } });
  trendingTVShows.value = response.data.results;
};

const fetchPopularActors = async () => {
  try {
    const response = await api.get("person/popular", {
      params: { language: "pt-BR", page: 1 },
    });
    popularActors.value = response.data.results.slice(0, 20);
  } catch (error) {
    console.error("Erro ao buscar os atores populares:", error);
  }
};

const fetchTrendingTrailers = async () => {
  try {
    const response = await api.get("movie/popular", { params: { language: "pt-BR" } });
    const moviesWithTrailers = await Promise.all(
      response.data.results.slice(0, 5).map(async (movie) => {
        const videosResponse = await api.get(`movie/${movie.id}/videos`, {
          params: { language: "pt-BR" },
        });
        const trailer = videosResponse.data.results.find((video) => video.type === "Trailer");
        return {
          title: movie.title,
          backdropPath: movie.backdrop_path,
          trailerKey: trailer ? trailer.key : null,
        };
      })
    );
    trendingTrailers.value = moviesWithTrailers.filter((item) => item.trailerKey);
  } catch (error) {
    console.error("Erro ao buscar os trailers:", error);
  }
};

// Funções de navegação para os detalhes
const goToMovieDetails = (movieId) => {
  router.push({ name: "MovieDetails", params: { movieId } });
};

const goToTVDetails = (tvId) => {
  router.push({ name: "TVDetails", params: { tvId } });
};

const goToActorDetails = (actorId) => {
  router.push({ name: "ActorDetails", params: { actorId } });
};

// Função para definir o fundo da seção de trailers
const setTrailerBackground = (backdropPath) => {
  activeTrailerBackground.value = `https://image.tmdb.org/t/p/original${backdropPath}`;
};

// Chama as funções no mounted
onMounted(async () => {
  await Promise.all([
    fetchNowPlayingMovies(),
    fetchTrendingTVShows(),
    fetchPopularActors(),
    fetchTrendingTrailers(),
  ]);
});
</script>

<template>
  <div class="home">
    <!-- Logo e nome -->
    <div class="logo-container">
      <img src="../assets/logo.png" alt="Logo" class="logo-image" />
    </div>
   
    <h1>Resultados da Pesquisa</h1>
    <div v-if="searchResults.movies.length > 0">
      <h2>Filmes</h2>
      <div class="results">
        <div v-for="movie in searchResults.movies" :key="movie.id">
          <h3>{{ movie.title }}</h3>
          <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" alt="Imagem do filme" />
        </div>
      </div>
    </div>
    <div v-if="searchResults.tv.length > 0">
      <h2>Programas de TV</h2>
      <div class="results">
        <div v-for="tv in searchResults.tv" :key="tv.id">
          <h3>{{ tv.name }}</h3>
          <img :src="`https://image.tmdb.org/t/p/w500${tv.poster_path}`" alt="Imagem do programa de TV" />
        </div>
      </div>
    </div>
    <div v-else>
      <p>Nenhum resultado encontrado.</p>
    </div>

    <!-- Seção 1: Filmes em Cartaz -->
    <section class="carousel-section">
      <h2>🎬 Filmes em Cartaz</h2>
      <div class="carousel">
        <div
          v-for="movie in nowPlayingMovies"
          :key="movie.id"
          class="carousel-item"
          @click="goToMovieDetails(movie.id)"
        >
          <img :src="`https://image.tmdb.org/t/p/w780${movie.poster_path}`" :alt="movie.title" class="carousel-image"/>
          <p>{{ movie.title }}</p>
        </div>
      </div>
    </section>

    <!-- Seção 2: Trailers Populares -->
    <section
      class="trailer-section"
      :style="{ backgroundImage: `url(${activeTrailerBackground})` }"
    >
      <h2>🎥 Trailers Populares</h2>
      <div class="trailer-list">
        <div
          v-for="trailer in trendingTrailers"
          :key="trailer.trailerKey"
          class="trailer-item"
          @mouseover="setTrailerBackground(trailer.backdropPath)"
        >
          <a 
            :href="'https://www.youtube.com/watch?v=' + trailer.trailerKey" 
            target="_blank" 
            class="trailer-link"
          >
            <img
              :src="`https://img.youtube.com/vi/${trailer.trailerKey}/mqdefault.jpg`"
              :alt="trailer.title"
              class="trailer-image"
            />
            <div class="play-overlay">
              <i class="fas fa-play"></i>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Seção 3: Programas de TV -->
    <section class="carousel-section">
      <h2>📺 Programas de TV Populares</h2>
      <div class="carousel">
        <div
          v-for="tv in trendingTVShows"
          :key="tv.id"
          class="carousel-item"
          @click="goToTVDetails(tv.id)"
        >
          <img :src="`https://image.tmdb.org/t/p/w780${tv.poster_path}`" :alt="tv.name" class="carousel-image"/>
          <p>{{ tv.name }}</p>
        </div>
      </div>
    </section>

    <!-- Seção 4: Atores em Destaque -->
    <section class="carousel-section">
      <h2>⭐ Atores Populares</h2>
      <div class="carousel">
        <div
          v-for="actor in popularActors"
          :key="actor.id"
          class="carousel-item"
          @click="goToActorDetails(actor.id)"
        >
          <img :src="`https://image.tmdb.org/t/p/w500${actor.profile_path}`" :alt="actor.name" class="carousel-image"/>
          <p>{{ actor.name }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  padding: 2rem;
  background-color: #121212;
  color: #f4f4f4;
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

/* Logo e nome */
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
}

.logo-image {
  width: 300px;
  height: 300px;
  margin-right: 1rem;
}

/* Personalizando a scrollbar */
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: #ffcc00;
  border-radius: 10px;
  border: 2px solid #121212;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #ffcc00;
}

::-webkit-scrollbar-button {
  display: none;
}
/* Estilos para a seção de carrosséis */
.carousel-section,
.trailer-section {
  margin-bottom: 3rem;
}

.carousel-section h2,
.trailer-section h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #ffcc00;
}

.carousel {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding-bottom: 1rem;
}

.carousel-item {
  flex: 0 0 auto;
  width: 200px;
  text-align: center;
  position: relative;
}

.carousel-item img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 0.5rem;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.carousel-item:hover img {
  transform: scale(1.05);
  opacity: 0.8;
}

/* Estilos da seção de trailers */
.trailer-section {
  background-size: cover;
  background-position: center;
  padding: 4rem 2rem;
  border-radius: 0.5rem;
  position: relative;
  overflow: hidden;
  height: 500px;
}

.trailer-section h2 {
  font-size: 2.5rem;
  color: white;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.7);
  margin-bottom: 1rem;
}

.trailer-list {
  display: flex;
  justify-content: center;
  gap: 2rem;
  position: absolute;
  bottom: 2rem;
  width: 100%;
}

.trailer-item {
  position: relative;
  width: 250px;
  cursor: pointer;
}

.trailer-image {
  width: 100%;
  height: 140px;
  border-radius: 0.5rem;
  transition: transform 0.3s ease;
}

.trailer-item:hover .trailer-image {
  transform: scale(1.05);
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 2rem;
  opacity: 0;
  transition: opacity 0.3s;
}

.trailer-item:hover .play-overlay {
  opacity: 1;
}

.trailer-link {
  display: block;
  text-decoration: none;
}
</style>
