import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/filmes',
    name: 'Movies',
    component: () => import('../views/MoviesView.vue'),
  },
  {
    path: '/movie/:movieId',
    name: 'MovieDetails',
    component: () => import('../views/MovieDetailsView.vue'),
    props: true,
  },
  {
    path: '/tv',
    name: 'TV',
    component: () => import('../views/TvView.vue'),
  },
  {
    path: '/tvdetail/:tvId',
    name: 'TVDetails',
    component: () => import('@/views/TvDetailsView.vue'),
    props: true, // Garante que os parâmetros sejam passados como props
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;