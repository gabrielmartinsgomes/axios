// store/tv.js
import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useTVStore = defineStore('tv', {
  state: () => ({
    currentTV: {},
  }),
  actions: {
    async getTVDetail(tvId) {
      const response = await api.get(`tv/${tvId}`, {
        params: { language: 'pt-BR' },
      });
      this.currentTV = response.data;
    },
    async searchTVShows(query) {
      const response = await api.get('search/tv', {
        params: {
          query: query,
          language: 'pt-BR',
        },
      });
      return response.data.results;  // Retorna a lista de resultados
    },
  },
});
