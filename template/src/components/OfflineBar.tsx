import { useIsOffline } from '@oneblink/apps-react'
import styled, { css } from 'styled-components'

type OfflineProps = {
  $isOffline: boolean
}

const OfflineContainer = styled.div<OfflineProps>`
  position: fixed;
  bottom: 0;
  width: 100%;
  font-size: ${({ theme }) => theme.font.small};
  color: ${({ theme }) => theme.palette.white};
  background: ${({ theme, $isOffline }) =>
    $isOffline ? theme.palette.errorRed : theme.palette.successGreen};
  text-align: center;
  transform: translateY(100%);
  transition: transform 0.2s ease-in 0.15s;
  ${(props) =>
    props.$isOffline &&
    css`
      transform: translateY(0);
    `};
  z-index: 2;
`

export default function OfflineBar() {
  const isOffline = useIsOffline()

  return (
    <OfflineContainer $isOffline={isOffline}>
      {isOffline ? 'Offline' : 'Online'}
    </OfflineContainer>
  )
}
