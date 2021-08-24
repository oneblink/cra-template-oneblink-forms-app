import { useCallback } from 'react'
import { authService } from '@oneblink/apps'
import config from '../../config'

function LogInButton() {
  const signIn = useCallback(async () => {
    await authService?.loginHostedUI(config.OB_COGNITO_CLIENT_ID)
  }, [])

  return <button className="button ob-button is-primary" onClick={signIn}>Log In</button>
}

export default LogInButton
