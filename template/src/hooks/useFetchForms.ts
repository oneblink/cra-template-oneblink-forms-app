import * as React from 'react'

import { formService } from '@oneblink/apps'
import { useIsOffline, useIsMounted } from '@oneblink/apps-react'
import { FormTypes } from '@oneblink/types'

import config from 'config'

export default function useFetchForms() {
  const isMounted = useIsMounted()
  const isOffline = useIsOffline()

  const [{ isLoading, loadError, forms }, setState] = React.useState<{
    isLoading: boolean
    loadError?: Error
    forms: FormTypes.Form[]
  }>({
    isLoading: true,
    loadError: undefined,
    forms: [],
  })

  const clearLoadError = React.useCallback(() => {
    setState((currentState) => ({
      ...currentState,
      loadError: undefined,
    }))
  }, [])

  const reloadFormsList = React.useCallback(async () => {
    if (isMounted.current) {
      setState((currentState) => ({
        isLoading: true,
        loadError: undefined,
        forms: currentState.forms,
      }))
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
      setState({
        isLoading: false,
        loadError: newError,
        forms: newForms,
      })
    }
  }, [isMounted])

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
