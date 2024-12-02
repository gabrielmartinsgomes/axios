<script setup>
import { ref, onMounted } from "vue";
import api from "@/plugins/axios";
import { useRouter } from "vue-router";

// Dados para os carrosséis
const nowPlayingMovies = ref([]);
const trendingTVShows = ref([]);
const popularActors = ref([]);

const router = useRouter();

// Estado dos carrosséis
const currentMoviePage = ref(0);
const currentTVPage = ref(0);
const currentActorPage = ref(0);

const ITEMS_PER_PAGE = 5;

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
      params: { language: "pt-BR", page: 2 }, // Obtém apenas a 1ª página de atores populares
    });
    // Mantém apenas os primeiros 10 atores mais famosos
    popularActors.value = response.data.results.slice(0, 20);
  } catch (error) {
    console.error("Erro ao buscar os atores populares:", error);
  }
};


// Chama as funções no mounted
onMounted(async () => {
  await Promise.all([
    fetchNowPlayingMovies(),
    fetchTrendingTVShows(),
    fetchPopularActors(), 
  ]);
});

// Funções de navegação para carrossel
const nextPage = (type) => {
  if (type === "movies" && (currentMoviePage.value + 1) * ITEMS_PER_PAGE < nowPlayingMovies.value.length) {
    currentMoviePage.value++;
  } else if (type === "tv" && (currentTVPage.value + 1) * ITEMS_PER_PAGE < trendingTVShows.value.length) {
    currentTVPage.value++;
  } else if (type === "actors" && (currentActorPage.value + 1) * ITEMS_PER_PAGE < popularActors.value.length) {
    currentActorPage.value++;
  }
};

const prevPage = (type) => {
  if (type === "movies" && currentMoviePage.value > 0) {
    currentMoviePage.value--;
  } else if (type === "tv" && currentTVPage.value > 0) {
    currentTVPage.value--;
  } else if (type === "actors" && currentActorPage.value > 0) {
    currentActorPage.value--;
  }
};

const goToMovieDetails = (movieId) => {
  router.push({ name: "MovieDetails", params: { movieId } });
};

const goToTVDetails = (tvId) => {
  router.push({ name: "TVDetails", params: { tvId } });
};
const goToActorDetails = (actorId) => {
  router.push({ name: "ActorDetails", params: { actorId } });
};


const getCarouselStyle = (index, currentPage) => {
  const offset = currentPage * ITEMS_PER_PAGE * 100; // Deslocamento baseado na página
  const itemWidth = 100 / ITEMS_PER_PAGE; // Largura de cada item
  const translateX = `calc(${index * itemWidth}% - ${offset}%)`;
  return {
    transform: `translateX(${translateX})`,
    transition: "transform 0.5s ease-in-out", // Animação suave ao trocar de página
  };
};
</script>





<template>
  <div class="home">
    <!-- Seção 1: Filmes em Cartaz -->
    <section class="carousel-section">
      <h2>🎬 Filmes em Cartaz</h2>
      <div class="carousel-wrapper">
        <button class="carousel-control prev" @click="prevPage('movies')">◀</button>
        <div class="carousel">
          <div
            v-for="(movie, index) in nowPlayingMovies"
            :key="movie.id"
            class="carousel-item"
            :style="getCarouselStyle(index, currentMoviePage)"
            @click="goToMovieDetails(movie.id)"
          >
            <img :src="`https://image.tmdb.org/t/p/w780${movie.poster_path}`" :alt="movie.title" />
            <p>{{ movie.title }}</p>
          </div>
        </div>
        <button class="carousel-control next" @click="nextPage('movies')">▶</button>
      </div>
      <div class="carousel-indicators">
        <span
          v-for="(_, index) in Math.ceil(nowPlayingMovies.length / ITEMS_PER_PAGE)"
          :key="index"
          :class="{ active: index === currentMoviePage }"
        ></span>
      </div>
    </section>

    <!-- Seção 2: Programas de TV -->
    <section class="carousel-section">
      <h2>📺 Principais Programas de TV</h2>
      <div class="carousel-wrapper">
        <button class="carousel-control prev" @click="prevPage('tv')">◀</button>
        <div class="carousel">
          <div
            v-for="(tv, index) in trendingTVShows"
            :key="tv.id"
            class="carousel-item"
            :style="getCarouselStyle(index, currentTVPage)"
            @click="goToTVDetails(tv.id)"
          >
            <img :src="`https://image.tmdb.org/t/p/w780${tv.poster_path}`" :alt="tv.name" />
            <p>{{ tv.name }}</p>
          </div>
        </div>
        <button class="carousel-control next" @click="nextPage('tv')">▶</button>
      </div>
      <div class="carousel-indicators">
        <span
          v-for="(_, index) in Math.ceil(trendingTVShows.length / ITEMS_PER_PAGE)"
          :key="index"
          :class="{ active: index === currentTVPage }"
        ></span>
      </div>
    </section>

    <!-- Seção 3: Atores em Destaque -->
    <section class="carousel-section">
      <h2>⭐ Atores em Destaque</h2>
      <div class="carousel-wrapper">
        <button class="carousel-control prev" @click="prevPage('actors')">◀</button>
        <div class="carousel">
          <div
              v-for="(actor, index) in popularActors"
              :key="actor.id"
              class="carousel-item"
              :style="getCarouselStyle(index, currentActorPage)"
              @click="goToActorDetails(actor.id)" 
            >
            <img :src="`https://image.tmdb.org/t/p/w500${actor.profile_path}`" :alt="actor.name" />
            <p>{{ actor.name }}</p>
          </div>

        </div>
        <button class="carousel-control next" @click="nextPage('actors')">▶</button>
      </div>
      <div class="carousel-indicators">
        <span
          v-for="(_, index) in Math.ceil(popularActors.length / ITEMS_PER_PAGE)"
          :key="index"
          :class="{ active: index === currentActorPage }"
        ></span>
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

.carousel-section {
  margin-bottom: 3rem;
  position: relative;
}

.carousel-section h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #ffcc00;
}

.carousel-wrapper {
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 600px; /* Altura comum para todas as seções */
}

.carousel {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-item {
  flex: 0 0 calc(100% / 5); /* Ajustado para 5 itens */
  text-align: center;
  margin: 0 0.5rem;
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Ajusta para mostrar o pôster inteiro */
  background-color: #000;
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.carousel-item img:hover {
  transform: scale(1.05); /* Zoom suave no hover */
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.6);
  border: none;
  font-size: 2rem;
  color: #ffcc00;
  cursor: pointer;
  z-index: 10;
  padding: 0.5rem;
  border-radius: 50%;
  box-shadow: 0 0 0.5rem #000;
}

.carousel-control.prev {
  left: 0.5rem;
}

.carousel-control.next {
  right: 0.5rem;
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.carousel-indicators span {
  width: 1rem;
  height: 1rem;
  margin: 0 0.5rem;
  background-color: #444;
  border-radius: 50%;
  cursor: pointer;
}

.carousel-indicators span.active {
  background-color: #ffcc00;
}

@media (max-width: 768px) {
  .carousel-item {
    flex: 0 0 calc(100% / 3);
  }

  .carousel-wrapper {
    height: 500px;
  }
}

@media (max-width: 480px) {
  .carousel-item {
    flex: 0 0 calc(100% / 2);
  }

  .carousel-wrapper {
    height: 400px;
  }
}
</style>