import React, { PropsWithChildren, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { formService, authService } from '@oneblink/apps'
import { useIsMounted } from '@oneblink/apps-react'
import { FormTypes } from '@oneblink/types'
import config from '../config'

import ErrorMessage from '../components/ErrorMessage'
import LoadingSpinner from 'components/LoadingSpinner'
import useOneBlinkError from 'hooks/useOneBlinkError'

type TFormsDefinitionContext = {
  forms: FormTypes.Form[]
  isFetching: boolean
}

const FormsDefinitionContext = React.createContext<TFormsDefinitionContext>({
  forms: [],
  isFetching: true,
})

export const useFormsDefinitions = function useFormsDefinitions() {
  return useContext(FormsDefinitionContext)
}

export default function FormsDefinitionProvider({
  children,
}: PropsWithChildren<Record<string, unknown>>) {
  const [formState, setFormState] = React.useState<{
    forms: FormTypes.Form[]
    isFetching: boolean
  }>({ forms: [], isFetching: true })
  const [fetchError, setFetchError] = useOneBlinkError()
  const isMounted = useIsMounted()
  const history = useHistory()

  React.useEffect(() => {
    const fetchForms = async () => {
      if (isMounted.current) {
        setFormState((currentState) => ({
          isFetching: true,
          fetchError: undefined,
          forms: currentState.forms,
        }))
      }

      try {
        const formsRes = await formService.getForms(config.OB_FORMS_APP_ID)
        if (!isMounted.current) return

        const newForms = formsRes.filter((form) => {
          const startDate = form.publishStartDate
            ? new Date(form.publishStartDate)
            : null
          const endDate = form.publishEndDate
            ? new Date(form.publishEndDate)
            : null
          const now = new Date()
          // Only return forms that are currently published
          return !((startDate && now < startDate) || (endDate && now > endDate))
        })

        formService.getFormElementDynamicOptions(newForms)
        setFormState({ forms: newForms, isFetching: false })
      } catch (e) {
        if (!isMounted.current) return
        if (
          e.originalError &&
          e.originalError.message === 'Refresh Token has been revoked'
        ) {
          console.log('Refresh token has been revoked, redirecting to login...')
          await authService.logout()
          history.replace('/')
          window.location.reload(true)
        } else {
          console.error(e)
          setFormState((current) => ({
            ...current,
            isFetching: false,
          }))
          setFetchError(e)
        }
      }
    }

    fetchForms()
  }, [isMounted, history, setFetchError])

  if (fetchError) {
    return <ErrorMessage>There has been an error fetching forms.</ErrorMessage>
  }

  if (formState.isFetching) {
    return <LoadingSpinner>Fetching data</LoadingSpinner>
  }

  return (
    <FormsDefinitionContext.Provider value={formState}>
      {children}
    </FormsDefinitionContext.Provider>
  )
}
