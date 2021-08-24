import { PropsWithChildren } from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'

import { authService } from '@oneblink/apps'

function AuthenticatedRoute({
  children,
  ...props
}: PropsWithChildren<RouteProps>) {
  const isLoggedIn = authService.isLoggedIn()

  return (
    <Route {...props}>
      {({ location }) => {
        return isLoggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }}
    </Route>
  )
}

export default AuthenticatedRoute
