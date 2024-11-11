import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOWVjZGU3OWQwNWU1MzE3YTJhZjU0MmI2YzU1ZTUxOSIsIm5iZiI6MTczMTM1MzAwOS4wNjM4MDEzLCJzdWIiOiI2NzMyNTgwY2YzZWFmYzUyMDFmZDU1MjMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.nNlqu_1GdPF5c1QUcgYJS9ZsoFV14JD9U-zaWwNQF-4`,
  },
});

export default api;