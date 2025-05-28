import { defineConfig } from 'vite';

// PUBLIC_INTERFACE
// Vite config that allows all origins (CORS) in development server.
export default defineConfig({
  server: {
    cors: {
      origin: '*', // Allows all origins
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: false,
      exposedHeaders: ['*'],
      maxAge: 86400,
    },
    host: '0.0.0.0',
  },
});
