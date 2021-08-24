import { useCallback } from 'react'
import { authService } from '@oneblink/apps'
import { useHistory } from 'react-router-dom'

function LogOutButton() {
  const history = useHistory()

  const signOut = useCallback(async () => {
    await authService.logout()
    history.push('/')
  }, [history])

  return <button className="button ob-button is-primary" onClick={signOut}>Log Out</button>
}

export default LogOutButton
