import React, { useEffect } from 'react'
import styled, { useTheme } from 'styled-components'
import useViewportSizes from 'use-viewport-sizes'

import Header from 'components/Layout/Header'
import Menu from '../Menu'
import MenuStateProvider from 'components/Menu/MenuStateProvider'
const FlexContainer = styled.div`
  display: flex;
  flex-grow: 1;
`

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const ChildrenContainer = styled.div`
  width: 100%;
  padding: 1rem;
`

export default function Page({ children }: { children: React.ReactNode }) {
  const theme = useTheme()

  const [vpWidth] = useViewportSizes({ debounceTimeout: 250 })
  const [position, setPosition] = React.useState<
    'left' | 'top' | 'right' | 'bottom' | void
  >()
  useEffect(() => {
    vpWidth &&
      setPosition(vpWidth > theme.screenSizes.largeTablet ? 'left' : 'top')
  }, [theme.screenSizes.largeTablet, vpWidth])

  return (
    <PageContainer>
      {position ? (
        <MenuStateProvider position={position}>
          <Header />
          <FlexContainer>
            <Menu>
              <ChildrenContainer>{children}</ChildrenContainer>
            </Menu>
          </FlexContainer>
        </MenuStateProvider>
      ) : null}
    </PageContainer>
  )
}
