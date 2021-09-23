import React from 'react'
import { Info } from '@styled-icons/material/Info'
import styled from 'styled-components'

const InfoIcon = styled(Info)`
  flex: 0 0 auto;
  margin-right: 1rem;
`
InfoIcon.displayName = 'InfoIcon'

const NotificationText = styled.p`
  flex: 1 1 auto;
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  display: inline;
`

const ReloadButton = styled.button.attrs(() => ({
  type: 'button',
}))`
  background: none;
  border: none;
  font-size: inherit;
  display: inline-block;
  padding: 0;
  color: inherit;
  font-weight: inherit;
  font-family: inherit;
  text-decoration: underline;
`

export default function UpdateNotification({
  sw,
}: {
  sw: ServiceWorkerRegistration
}) {
  const onReload = () => {
    if (sw.waiting) {
      sw.waiting.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  }

  return (
    <>
      <InfoIcon size={24} />
      <NotificationText>
        App has been updated. Please{' '}
        <ReloadButton onClick={onReload}>Reload</ReloadButton>
      </NotificationText>
    </>
  )
}
