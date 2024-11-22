import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import api from '@/plugins/axios'; // Certifique-se de que esse plugin está configurado corretamente

export const useTVStore = defineStore('tv', () => {
  const state = reactive({
    currentTV: {}, // Armazena os detalhes do programa de TV
  });

  const currentTV = computed(() => state.currentTV);

  const getTVDetail = async (tvId) => {
    try {
      const response = await api.get(`tv/${tvId}`, {
        params: {
          api_key: 'SUA_CHAVE_API', // Substitua pela sua chave da API do TMDB
          language: 'pt-BR',        // Defina o idioma como português (ou outro idioma)
        },
      });
      state.currentTV = response.data; // Armazena os dados retornados na variável `currentTV`
    } catch (error) {
      console.error('Erro ao buscar detalhes do programa de TV:', error);
    }
  };

  return { currentTV, getTVDetail };
});
