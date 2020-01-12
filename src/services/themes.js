import { colors } from 'quasar'

const darkTheme = {
  'name': 'Dark',
  'primary': '#333548',
  'secondary': '#484b66',
  'accent': '#242533',
  'dark': '#1c1d27',
  'positive': '#2ca18c',
  'negative': '#ef5064',
  'info': '#93949c',
  'warning': '#fcaf38'
}

const lightTheme = {
  'name': 'Light',
  'primary': '#008baf',
  'secondary': '#006883',
  'accent': '#ffffff',
  'dark': '#00aedb',
  'positive': '#519872',
  'negative': '#A10702',
  'info': '#232323',
  'warning': '#fcaf38'
}

export function enableTheme (theme) {
  if (theme === 'Dark') {
    setColors(darkTheme)
  } else {
    setColors(lightTheme)
  }
}

function setColors (theme) {
  colors.setBrand('primary', theme.primary)
  colors.setBrand('secondary', theme.secondary)
  colors.setBrand('accent', theme.accent)
  colors.setBrand('dark', theme.dark)
  colors.setBrand('positive', theme.positive)
  colors.setBrand('negative', theme.negative)
  colors.setBrand('info', theme.info)
  colors.setBrand('warning', theme.warning)
}
