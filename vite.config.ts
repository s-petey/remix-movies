import { vitePlugin as remix } from '@remix-run/dev';
import { installGlobals } from '@remix-run/node';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { flatRoutes } from 'remix-flat-routes';

installGlobals();

export default defineConfig(() => {
  return {
    plugins: [
      tsconfigPaths(),
      remix({
        ignoredRouteFiles: ['**/*'],
        serverModuleFormat: 'esm',
        routes: async (defineRoutes) => {
          return flatRoutes('routes', defineRoutes, {
            ignoredRouteFiles: ['**/*.test.{js,jsx,ts,tsx}', '**/__*.*'],
          });
        },
      }),
    ],
  };
});
