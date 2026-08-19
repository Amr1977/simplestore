import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.example.abuqirgrocery',
  appName: 'بقالة أبو قير',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#16a34a',
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#16a34a',
    },
  },
}

export default config
