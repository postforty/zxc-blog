import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command, mode }) => {
  const isBuild = command === 'build';
  const isSSR = isBuild && process.env.SSR;

  const baseConfig: UserConfig = {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: isSSR ? 'dist/server' : 'dist/client',
      rollupOptions: {
        input: isSSR ? path.resolve(__dirname, 'src/entry-server.tsx') : path.resolve(__dirname, 'index.html'), // Client entry point for dev, index.html for client build
      },
    },
  };

  if (isSSR) {
    // SSR build configuration
    return {
      ...baseConfig,
      build: {
        ...baseConfig.build,
        ssr: path.resolve(__dirname, 'src/entry-server.tsx'), // SSR entry point
        rollupOptions: {
          input: path.resolve(__dirname, 'src/entry-server.tsx'),
          output: {
            format: 'es',
          },
        },
      },
    };
  } else if (isBuild) {
    // Client production build configuration
    return {
      ...baseConfig,
      build: {
        ...baseConfig.build,
        rollupOptions: {
          input: path.resolve(__dirname, 'src/entry-client.tsx'), // Explicit client entry point for production build
        },
      },
    };
  }

  // Client development configuration
  return baseConfig;
});
