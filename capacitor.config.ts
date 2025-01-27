import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Lector',
  webDir: 'www',

  plugins: {
    CapacitorSQLite: {
      database: 'lecturas.db',
    },
  }
};

export default config;
