import { authService } from '@oneblink/apps'
import LogoutButton from 'components/Auth/LogoutButton'
import styled from 'styled-components'
import {H1} from 'components/TextComponents'

export default function Profile() {
  const name = authService.getUserFriendlyName()

  const GreetingContainer = styled.div`
    margin: 1rem 0;
  `
  GreetingContainer.displayName = 'GreetingContainer'

  return (
    <div>
      <H1>Profile</H1>
      <GreetingContainer>Hi {name}</GreetingContainer>
      <LogoutButton />
    </div>
  )
}
