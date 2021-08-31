import * as React from 'react'
import {
  submissionService,
  draftService,
  OneBlinkAppsError,
} from '@oneblink/apps'
import { useIsMounted } from '@oneblink/apps-react'
import { SubmissionTypes } from '@oneblink/types'
import { useHistory } from 'react-router-dom'
import config from '../config'
import useOneBlinkError from './useOneBlinkError'

export type OnConfirmSaveDraftType = (
  draftSubmission: submissionService.NewDraftSubmission,
  draftTitle: string,
  existingDraft?: SubmissionTypes.FormsAppDraft,
) => void

export default function useSaveDraft(): {
  isSavingDraft: boolean
  saveDraftError?: OneBlinkAppsError
  clearSaveDraftError: () => void
  tempDraftFormSubmissionResult?: submissionService.NewDraftSubmission
  onSaveDraft: (draft: submissionService.NewDraftSubmission) => void
  cancelSaveDraft: () => void
  onConfirmSaveDraft: OnConfirmSaveDraftType
} {
  const [isSavingDraft, setIsSavingDraft] = React.useState<boolean>(false)
  const [saveDraftError, setSaveDraftError] = useOneBlinkError()
  const [tempDraftFormSubmissionResult, setTempDraft] =
    React.useState<submissionService.NewDraftSubmission>()
  const isMounted = useIsMounted()
  const history = useHistory()

  const onConfirmSaveDraft = React.useCallback(
    async (
      draftSubmission: submissionService.NewDraftSubmission,
      draftTitle: string,
      existingDraft?: SubmissionTypes.FormsAppDraft,
    ) => {
      const draftFormSubmissionResult: submissionService.DraftSubmission = {
        ...draftSubmission,
        formsAppId: config.OB_FORMS_APP_ID,
      }
      setIsSavingDraft(true)
      try {
        const newDraft = {
          title: draftTitle,
          formId: draftFormSubmissionResult.definition.id,
          externalId: null,
          jobId: null,
        }
        if (existingDraft) {
          await draftService.updateDraft(
            {
              ...existingDraft,
              ...newDraft,
            },
            draftFormSubmissionResult,
          )
        } else {
          await draftService.addDraft(newDraft, draftFormSubmissionResult)
          setTempDraft(undefined)
        }
        if (isMounted.current) {
          setIsSavingDraft(false)
          history.push('/drafts')
        }
      } catch (e) {
        setIsSavingDraft(false)
        setSaveDraftError(e)
      }
    },
    [history, isMounted, setSaveDraftError],
  )

  return {
    isSavingDraft,
    saveDraftError,
    clearSaveDraftError: () => setSaveDraftError(),
    tempDraftFormSubmissionResult,
    onSaveDraft: setTempDraft,
    cancelSaveDraft: () => setTempDraft(undefined),
    onConfirmSaveDraft,
  }
}
