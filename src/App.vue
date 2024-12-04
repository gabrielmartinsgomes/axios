<template>
  <header>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/filmes">Filmes</router-link>
      <router-link to="/tv">Programas de TV</router-link>
    </nav>
    <div class="search-container">
      <input
        type="text"
        placeholder="Buscar..."
        class="search-input"
        v-model="searchQuery"
        @input="handleSearch"
      />
    </div>
  </header>
  <main>
    <router-view :searchResults="searchResults" />
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useMovieStore } from '@/stores/movie';
import { useTVStore } from '@/stores/tv';

const movieStore = useMovieStore();
const tvStore = useTVStore();
const searchQuery = ref('');
const searchResults = ref({ movies: [], tv: [] });

const handleSearch = async () => {
  if (searchQuery.value.trim() !== '') {
    // Chama a função de busca nos stores de filmes e programas de TV
    const movieResults = await movieStore.searchMovies(searchQuery.value);
    const tvResults = await tvStore.searchTVShows(searchQuery.value);
    searchResults.value = { movies: movieResults, tv: tvResults };
  } else {
    searchResults.value = { movies: [], tv: [] }; // Limpa os resultados se a busca estiver vazia
  }
};
</script>

<style scoped>
/* Estilos para o cabeçalho */
header {
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #121212;
  color: #fff;
  padding: 0 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

/* Estilos para a barra de navegação */
nav {
  column-gap: 2rem;
  display: flex;
  align-items: center;
}

nav a {
  text-decoration: none;
  color: #fff;
  padding: 0.5rem;
}

nav a:hover {
  color: #ffcc00;
  border-bottom: 2px solid #ffcc00;
}

/* Estilos para a barra de pesquisa */
.search-container {
  display: flex;
  align-items: center;
}

.search-input {
  background-color: #1a1a1a;
  color: #fff;
  border: 1px solid #333;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  width: 250px;
  font-size: 1rem;
  outline: none;
}

.search-input::placeholder {
  color: #bbb;
}

/* Efeito de foco para a barra de pesquisa */
.search-input:focus {
  border-color: #ffcc00;
  background-color: #121212;
}

/* Responsividade: Barra de navegação e pesquisa */
@media (max-width: 768px) {
  header {
    flex-direction: column;
    align-items: flex-start;
  }

  nav {
    margin-top: 1rem;
  }

  .search-container {
    margin-top: 1rem;
  }
}
</style>