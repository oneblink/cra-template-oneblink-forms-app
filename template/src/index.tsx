import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {
  IsOfflineContextProvider,
  AuthContextProvider,
} from '@oneblink/apps-react'
import { authService } from '@oneblink/apps'
import config from './config'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

authService.init({
  oAuthClientId: config.OB_COGNITO_CLIENT_ID,
})

ReactDOM.render(
  <React.StrictMode>
    <IsOfflineContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </IsOfflineContextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

serviceWorkerRegistration.register()