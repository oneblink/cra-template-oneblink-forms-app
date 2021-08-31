import React from 'react'
import { useHistory } from 'react-router-dom'
import { submissionService } from '@oneblink/apps'
import { useIsMounted } from '@oneblink/apps-react'
import config from '../config'
import useOneBlinkError from './useOneBlinkError'

export default function useSubmitForm() {
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)
  const [submissionError, setSubmissionError] = useOneBlinkError()
  const [formSubmissionResult, setFormSubmissionResult] =
    React.useState<submissionService.FormSubmissionResult>()
  const [
    postSubmissionActionErrorMessage,
    setPostSubmissionActionErrorMessage,
  ] = useOneBlinkError()
  const history = useHistory()
  const isMounted = useIsMounted()

  const handlePostSubmissionAction = React.useCallback(
    async (formSubmissionResult: submissionService.FormSubmissionResult) => {
      try {
        await submissionService.executePostSubmissionAction(
          formSubmissionResult,
          history.push,
        )
      } catch (error) {
        console.warn('Could not execute post submission action', error)
        if (isMounted.current) {
          setPostSubmissionActionErrorMessage(error.message)
        }
      }
    },
    [history.push, isMounted, setPostSubmissionActionErrorMessage],
  )

  const onSubmit = React.useCallback(
    async (newFormSubmission: submissionService.NewFormSubmission) => {
      const formSubmission: submissionService.FormSubmission = Object.assign(
        {},
        newFormSubmission,
        {
          formsAppId: config.OB_FORMS_APP_ID,
          jobId: null,
          externalId: null,
          draftId: null,
          preFillFormDataId: null,
        },
      )

      setIsSubmitting(true)
      try {
        const submissionResult = await submissionService.submit({
          formSubmission,
        })
        setFormSubmissionResult(submissionResult)
      } catch (e) {
        setSubmissionError(e)
        setIsSubmitting(false)
      }
    },
    [setSubmissionError],
  )

  return {
    onSubmit,
    isSubmitting,
    formSubmissionResult,
    submissionError,
    setSubmissionError,
    handlePostSubmissionAction,
    postSubmissionActionErrorMessage,
  }
}
