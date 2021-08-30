import React from 'react'
import { formService } from '@oneblink/apps'
import { useIsMounted } from '@oneblink/apps-react'
import { FormTypes } from '@oneblink/types'
import useOneBlinkError from './useOneBlinkError'

export default function useFetchForm(formId: number) {
  const [formDefinition, setFormDefinition] =
    React.useState<FormTypes.Form | null>(null)

  const [fetchFormError, setFetchFormError] = useOneBlinkError()

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
  }, [isMounted, formId, setFetchFormError])

  return {
    formDefinition,
    fetchFormError,
    isFetchingForm,
  }
}
