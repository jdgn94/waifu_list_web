/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '@/styles/main.scss'

// Composables
import { createVuetify, ThemeDefinition } from 'vuetify'

const winterLight: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#1565C0',
    secondary: '#00897B',
    accent: '#82B1FF',
    error: '#F44336',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
  },
}

const winterDark: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#1565C0',
    secondary: '#00695C',
    accent: '#448AFF',
    error: '#C62828',
    info: '#1976D2',
    success: '#388E3C',
    warning: '#FFB300',
  },
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: winterLight,
      dark: winterDark,
    },
  },
})
