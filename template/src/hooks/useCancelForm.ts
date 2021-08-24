import React from 'react'
import { useHistory } from 'react-router-dom'
import { submissionService } from '@oneblink/apps'
import { FormTypes } from '@oneblink/types'

export default function useCancelForm(
  formDefinition: FormTypes.Form,
): [() => void] {
  const history = useHistory()
  const onCancel = React.useCallback(async () => {
    if (formDefinition) {
      await submissionService.executeCancelAction(
        { definition: formDefinition, externalId: null },
        history.push,
      )
    }
  }, [history, formDefinition])

  return [onCancel]
}
