// store/movie.js
import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useMovieStore = defineStore('movie', {
  state: () => ({
    currentMovie: {},
  }),
  actions: {
    async getMovieDetail(movieId) {
      const response = await api.get(`movie/${movieId}`, {
        params: { language: 'pt-BR' },
      });
      this.currentMovie = response.data;
    },
    async searchMovies(query) {
      const response = await api.get('search/movie', {
        params: {
          query: query,
          language: 'pt-BR',
        },
      });
      return response.data.results;  // Retorna a lista de resultados
    },
  },
});
