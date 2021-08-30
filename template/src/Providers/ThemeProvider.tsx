import React, { PropsWithChildren } from 'react'
import {
  ThemeProvider as ThemeProviderSC,
  DefaultTheme,
} from 'styled-components'

const screenSizes = {
  phone: 480,
  tablet: 768,
  largeTablet: 1024,
}

const theme: DefaultTheme = {
  palette: {
    primaryColor: '#FCB900',
    secondaryColor: '#009ED5',
    successGreen: '#43A047',
    errorRed: '#B81237',
    white: '#FFFFFF',
    panelBackground: '#f5f5f5',
    grey: 'rgba(0,0,0,0.5)',
    lightgrey: '#CCCCCC',
  },
  font: {
    base: '100%', // == 16px
    body: '1rem',
    heading: '1.5rem',
    subHeading: '1.25rem',
    caption: '0.875rem',
    small: `0.75rem`,
    button: '1.75rem',
    color: {
      menu: '#0a0a0a',
    },
  },
  fontWeight: {
    regular: 400,
    bold: 800,
  },
  unit: 16,
  breakPoints: {
    phone: `max-width: ${screenSizes.phone}px`,
    tablet: `max-width: ${screenSizes.tablet}px`,
    largeTablet: `max-width: ${screenSizes.largeTablet}px`,
  },
  screenSizes,
}

export default function ThemeProvider({
  children,
}: PropsWithChildren<Record<string, unknown>>) {
  return <ThemeProviderSC theme={theme}>{children}</ThemeProviderSC>
}
