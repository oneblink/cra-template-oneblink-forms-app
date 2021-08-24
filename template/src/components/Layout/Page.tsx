import React from 'react'
import styled from 'styled-components'

import Header from 'components/Layout/Header'
import Menu from '../Menu'
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
  return (
    <PageContainer>
      <Header />
      <FlexContainer>
        <Menu position="left">
          <ChildrenContainer>{children}</ChildrenContainer>
        </Menu>
      </FlexContainer>
    </PageContainer>
  )
}
