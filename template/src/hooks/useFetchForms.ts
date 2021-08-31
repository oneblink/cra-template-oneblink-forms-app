import * as React from 'react'

import { formService } from '@oneblink/apps'
import { useIsOffline, useIsMounted } from '@oneblink/apps-react'
import { FormTypes } from '@oneblink/types'

import config from 'config'
import useOneBlinkError from './useOneBlinkError'

export default function useFetchForms() {
  const isMounted = useIsMounted()
  const isOffline = useIsOffline()
  const [loadError, setLoadError] = useOneBlinkError()

  const [{ isLoading, forms }, setState] = React.useState<{
    isLoading: boolean
    forms: FormTypes.Form[]
  }>({
    isLoading: true,
    forms: [],
  })

  const clearLoadError = React.useCallback(() => {
    setLoadError()
  }, [setLoadError])

  const reloadFormsList = React.useCallback(async () => {
    if (isMounted.current) {
      setState((currentState) => ({
        isLoading: true,
        forms: currentState.forms,
      }))
      setLoadError()
    }

    let newError = null
    let newForms: FormTypes.Form[] = []

    try {
      const allForms = await formService.getForms(config.OB_FORMS_APP_ID)
      newForms = allForms.filter((form) => {
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

      await formService.getFormElementDynamicOptions(newForms)
    } catch (error) {
      newError = error
    }

    if (isMounted.current) {
      setLoadError(newError)
      setState({
        isLoading: false,
        forms: newForms,
      })
    }
  }, [isMounted, setLoadError])

  React.useEffect(() => {
    reloadFormsList()
  }, [isOffline, reloadFormsList])

  return {
    loadError,
    isLoading,
    forms,
    actions: {
      clearLoadError,
    },
  }
}
