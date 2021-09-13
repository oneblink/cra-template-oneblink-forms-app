import styled from 'styled-components'
import { Person, Reply } from '@styled-icons/material-outlined'
import { useLocation, useHistory, Link } from 'react-router-dom'
import MenuToggle from 'components/Menu/MenuToggle'

const HeaderContainer = styled.div`
  max-height: 80px;
  background-color: ${({ theme }) => theme.palette.primaryColor};
  width: 100%;
  margin: 0 auto;
  flex: 0 1 auto;
  display: flex;
  align-items: center;
  padding: 8px;
`
HeaderContainer.displayName = 'HeaderContainer'

const IconContainer = styled.div`
  display: flex;
  align-items: center;
`

IconContainer.displayName = 'IconContainer'

const baseIconStyle = `
  height: 2rem;
  color: #ffffff;
  align-self: center;
  padding: 0 1rem;
`

const BackIcon = styled(Reply)<{ $visible: boolean }>`
  ${baseIconStyle}
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  cursor: pointer;
`
BackIcon.displayName = 'BackIcon'

const ProfileLink = styled(Link)`
  margin-left: auto;
`
ProfileLink.displayName = 'ProfileLink'

const ProfileIcon = styled(Person)<{ $visible: boolean }>`
  ${baseIconStyle}
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  cursor: pointer;
`
ProfileIcon.displayName = 'ProfileIcon'

export default function Header() {
  const location = useLocation()
  const history = useHistory()

  return (
    <HeaderContainer>
      <MenuToggle />
      <BackIcon
        $visible={
          !(location.pathname === '/' || location.pathname === '/login')
        }
        onClick={() => history.goBack()}
      />
      <ProfileLink to="/profile">
        <ProfileIcon $visible={location.pathname !== '/login'} />
      </ProfileLink>
    </HeaderContainer>
  )
}
