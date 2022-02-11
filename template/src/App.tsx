import { useEffect, useRef } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import AuthenticatedRoute from 'components/AuthenticatedRoute'
import OAuthCallback from 'components/Auth/OAuthCallback'
import OfflineBar from 'components/OfflineBar'

import ThemeProvider from 'Providers/ThemeProvider'
import AppStylesProvider from 'Providers/AppStylesProvider'
import FormDefinitionProvider from 'Providers/FormDefinitionProvider'

import Page from 'components/Layout/Page'
import { H1 } from 'components/TextComponents'

import LoginScene from 'Scenes/Login'
import FormContainer from 'Scenes/Form/FormContainer'
import FormsListScene from 'Scenes/FormsList'
import DraftsScene from 'Scenes/Drafts'
import ProfileScene from 'Scenes/Profile'
import PendingQueueListScene from 'Scenes/Pending'
import { useIsOffline, useAuth } from '@oneblink/apps-react'
import { submissionService } from '@oneblink/apps'

import { ToastContainer, Slide, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import * as serviceWorker from './serviceWorkerRegistration'
import ServiceWorkerNotification from './components/ServiceWorkerNotification'

import '@oneblink/apps-react/dist/styles.css'

export default function App() {
  const isOffline = useIsOffline()
  const { isLoggedIn } = useAuth()
  const hasInstalledServiceWorker = useRef(false)

  useEffect(() => {
    if (hasInstalledServiceWorker.current) return
    console.log('installing service worker')
    serviceWorker.register({
      onSuccess: () => {
        console.log('service worker installed')
      },
      onUpdate: (sw) => {
        toast.info(<ServiceWorkerNotification sw={sw} />, {
          position: 'bottom-right',
          hideProgressBar: true,
          autoClose: false,
        })
      },
    })
    hasInstalledServiceWorker.current = true
  }, [])

  useEffect(() => {
    if (!isOffline && isLoggedIn) {
      console.info('processing pending submissions')
      submissionService.processPendingQueue()
    }
  }, [isOffline, isLoggedIn])

  return (
    <Router>
      <ThemeProvider>
        <AppStylesProvider>
          <OfflineBar />
          <Page>
            <Switch>
              <Route path="/callback">
                <OAuthCallback />
              </Route>
              <Route path="/login">
                <LoginScene />
              </Route>
              <FormDefinitionProvider>
                <Switch>
                  <AuthenticatedRoute path="/profile">
                    <ProfileScene />
                  </AuthenticatedRoute>
                  <AuthenticatedRoute path="/forms/:formId" exact>
                    <FormContainer />
                  </AuthenticatedRoute>
                  <AuthenticatedRoute path="/drafts" exact>
                    <DraftsScene />
                  </AuthenticatedRoute>
                  <AuthenticatedRoute path="/pending" exact>
                    <PendingQueueListScene />
                  </AuthenticatedRoute>
                  <AuthenticatedRoute path="/" exact>
                    <H1>OneBlink Forms!</H1>
                    <FormsListScene />
                  </AuthenticatedRoute>
                </Switch>
              </FormDefinitionProvider>
            </Switch>
          </Page>
        </AppStylesProvider>
        <ToastContainer transition={Slide} />
      </ThemeProvider>
    </Router>
  )
}
