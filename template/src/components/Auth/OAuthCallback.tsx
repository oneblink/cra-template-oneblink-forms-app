import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'

import Loading from 'components/LoadingSpinner'
import ErrorMessage from 'components/ErrorMessage'
import { useIsMounted } from '@oneblink/apps-react'
import { authService } from '@oneblink/apps'
import LoginButton from 'components/Auth/LoginButton'
import useOneBlinkError from 'hooks/useOneBlinkError'

export default function OAuthCallbackRoute() {
  const [continueTo, setContinueTo] = useState('')
  const isMounted = useIsMounted()
  const [errorMessage, setErrorMessage] = useOneBlinkError()

  useEffect(() => {
    const handleAuth = async () => {
      console.log('finalising authentication')
      let continueResponse = ''
      try {
        continueResponse = await authService.handleAuthentication()
      } catch (e) {
        setErrorMessage('Sorry, We were unable to verify your login details')
      }

      if (isMounted.current) {
        console.log(`redirecting to ${continueResponse}`)
        setContinueTo(
          continueResponse.endsWith('login') ? '/' : continueResponse,
        )
      }
    }
    !continueTo && handleAuth()
  }, [continueTo, isMounted, setErrorMessage])

  if (!!errorMessage) {
    return (
      <ErrorMessage>
        <h2>We cant log you in</h2>

        <p>{errorMessage.message}</p>

        <LoginButton />
      </ErrorMessage>
    )
  }

  if (!continueTo) {
    return <Loading>Loading Application...</Loading>
  }

  return <Redirect push to={continueTo} />
}
