import { ReactNode } from 'react'
import styled from 'styled-components'
import {Error} from '@styled-icons/material'

const ErrorIcon = styled(Error)`
  width: 100px;
  height: 100px;
  padding-bottom: 16px
`
ErrorIcon.displayName = 'ErrorIcon'

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export default function ErrorMessage({ children }: { children?: ReactNode }) {
  return (
    <ErrorContainer>
      <ErrorIcon />
      {children}
    </ErrorContainer>
  )
}
