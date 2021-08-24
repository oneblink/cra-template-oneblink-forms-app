import React from 'react'
import { formService, OneBlinkAppsError } from '@oneblink/apps'
import { useIsMounted } from '@oneblink/apps-react'
import { FormTypes } from '@oneblink/types'

export default function useFetchForm(formId: number) {
  const [formDefinition, setFormDefinition] =
    React.useState<FormTypes.Form | null>(null)

  const [fetchFormError, setFetchFormError] =
    React.useState<OneBlinkAppsError | null>(null)

  const [isFetchingForm, setIsFetchingForm] = React.useState<boolean>(true)

  const isMounted = useIsMounted()

  React.useEffect(() => {
    const fetchForm = async () => {
      try {
        const formRes = await formService.getForm(formId)
        setFormDefinition(formRes)
        if (!isMounted.current) return
      } catch (e) {
        if (!isMounted.current) return
        console.error(e)
        setFetchFormError(e)
      } finally {
        setIsFetchingForm(false)
      }
    }
    fetchForm()
  }, [isMounted, formId])

  return {
    formDefinition,
    fetchFormError,
    isFetchingForm,
  }
}
