import React, { PropsWithChildren, useContext } from 'react'
import { useIsMounted } from '@oneblink/apps-react'
import { FormsAppsTypes } from '@oneblink/types'

type AppStyles = Omit<FormsAppsTypes.FormsListStyles, 'customCss' | 'menuItems'>

interface TAppStylesContext extends AppStyles {
  isFetching: boolean
}

const AppStylesContext = React.createContext<TAppStylesContext>({
  logoUrl: undefined,
  buttons: {},
  isFetching: true,
})

export function useAppStyles() {
  return useContext(AppStylesContext)
}

export default function AppStylesProvider({
  children,
}: PropsWithChildren<Record<string, unknown>>) {
  const [stylesState, setStylesState] = React.useState<{
    styles?: AppStyles
    isFetching: boolean
  }>({ isFetching: true, styles: {} })
  const isMounted = useIsMounted()

  React.useEffect(() => {
    /* In here you can define a function to call an API, 
    either OneBlink hosted or externally hosted and retrieve the 
    App Styles using the OneBlink sdk 
    https://github.com/oneblink/sdk-node-js
    https://github.com/oneblink/sdk-dotnet
    */

    setStylesState({ isFetching: false, styles: {} })
  }, [isMounted])

  if (!stylesState.styles) return null

  const value = {
    ...stylesState.styles,
    isFetching: stylesState.isFetching,
  }

  return (
    <AppStylesContext.Provider value={value}>
      {children}
    </AppStylesContext.Provider>
  )
}
