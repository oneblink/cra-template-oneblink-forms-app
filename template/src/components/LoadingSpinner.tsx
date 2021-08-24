import React, { ReactNode } from 'react'
import Spinner from '@oneblink/apps-react/dist/components/OnLoading'
import styled from 'styled-components'

const SpinnerContainer = styled.div`
  padding-bottom: 16px;
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export default function Loading({ children }: { children?: ReactNode }) {
  return (
    <LoadingContainer>
      <SpinnerContainer>
        <Spinner />
      </SpinnerContainer>
      {children}
    </LoadingContainer>
  )
}
