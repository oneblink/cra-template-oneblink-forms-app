import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    palette: {
      primaryColor: string
      secondaryColor: string
      successGreen: string
      errorRed: string
      white: string
      panelBackground: string
      grey: string
      lightgrey: string
    }
    font: {
      base: string
      body: string
      heading: string
      subHeading: string
      caption: string
      small: string
      button: string
      color: {
        menu: string
      }
    }
    fontWeight: {
      regular: number
      bold: number
    }
    unit: number
    screenSizes: {
      phone: string
      tablet: string
      largeTablet: string
    }
  }
}
