import React from 'react'
import {
  OneBlinkFormControlled,
  useFormSubmissionAutoSaveState,
  useFormSubmissionState,
} from '@oneblink/apps-react'
import { FormTypes } from '@oneblink/types'

import config from '../../config'
import LoadingSpinner from 'components/LoadingSpinner'
import Modal from 'components/Modal'
import ErrorModal from 'components/Modals/ErrorModal'
import SubmissionModal from 'components/Modals/SubmissionModal'
import ConfirmSaveDraftModal from 'components/Modals/ConfirmSaveDraftModal'
import useSubmitForm from 'hooks/useSubmitForm'
import useCancelForm from 'hooks/useCancelForm'
import useSaveDraft, { OnConfirmSaveDraftType } from 'hooks/useSaveDraft'
import { SetErrorFn } from 'hooks/useOneBlinkError'

import { OneBlinkAppsError, submissionService } from '@oneblink/apps'

type Props = {
  form: FormTypes.Form
  preFillData: Record<string, unknown>
  existingDraft?: DraftAndData
  updateDefinition: (
    definition: FormTypes.Form,
    submission: Record<string, unknown>,
  ) => FormTypes.Form
  updateSubmission: (
    submission: Record<string, unknown>,
    definition: FormTypes.Form,
  ) => Record<string, unknown>
  buttons?: Record<string, unknown>
}

type FormSubmissionState = {
  definition: FormTypes.Form
  submission: Record<string, unknown>
}

function ControlledFormContainer({
  form,
  preFillData,
  existingDraft,
  autoSaveKey,
  updateDefinition,
  updateSubmission,
  buttons,
}: Props & { autoSaveKey?: string }) {
  if (autoSaveKey) {
    return (
      <ControlledFormWithAutosave
        form={form}
        preFillData={preFillData}
        existingDraft={existingDraft}
        updateDefinition={updateDefinition}
        updateSubmission={updateSubmission}
        autoSaveKey={autoSaveKey}
        buttons={buttons}
      />
    )
  } else {
    return (
      <ControlledForm
        form={form}
        preFillData={preFillData}
        existingDraft={existingDraft}
        updateDefinition={updateDefinition}
        updateSubmission={updateSubmission}
        buttons={buttons}
      />
    )
  }
}

function ControlledForm({
  form,
  preFillData,
  existingDraft,
  updateDefinition,
  updateSubmission,
  buttons,
}: Props) {
  const [onCancel] = useCancelForm(form)

  const {
    onSubmit,
    isSubmitting,
    formSubmissionResult,
    submissionError,
    setSubmissionError,
    handlePostSubmissionAction,
    postSubmissionActionErrorMessage,
  } = useSubmitForm()

  const {
    tempDraftFormSubmissionResult,
    isSavingDraft,
    cancelSaveDraft,
    onConfirmSaveDraft,
    onSaveDraft,
    saveDraftError,
    clearSaveDraftError,
  } = useSaveDraft()

  const [
    { definition, submission: liveSubmission },
    setFormSubmission,
  ] = useFormSubmissionState(form, preFillData)

  const customDefinition = React.useMemo(() => {
    return updateDefinition(definition, liveSubmission)
  }, [definition, updateDefinition, liveSubmission])

  const customSetFormSubmission = React.useCallback(
    (formSubmission) => {
      setFormSubmission((currentState: FormSubmissionState) => {
        const newFormSubmission: FormSubmissionState =
          typeof formSubmission === 'function'
            ? formSubmission(currentState)
            : formSubmission

        return {
          submission: updateSubmission(
            newFormSubmission.submission,
            customDefinition,
          ),
          definition: customDefinition,
        }
      })
    },
    [setFormSubmission, updateSubmission, customDefinition],
  )

  if (isSubmitting) {
    return <LoadingSpinner>Submitting</LoadingSpinner>
  }

  return (
    <ControlledFormBase
      form={form}
      customDefinition={customDefinition}
      liveSubmission={liveSubmission}
      handleCancel={onCancel}
      handleSubmit={onSubmit}
      onSaveDraft={onSaveDraft}
      customSetFormSubmission={customSetFormSubmission}
      existingDraft={existingDraft}
      isSavingDraft={isSavingDraft}
      saveDraftError={saveDraftError}
      clearSaveDraftError={clearSaveDraftError}
      tempDraftFormSubmissionResult={tempDraftFormSubmissionResult}
      cancelSaveDraft={cancelSaveDraft}
      onConfirmSaveDraft={onConfirmSaveDraft}
      isSubmitting={isSubmitting}
      submissionError={submissionError}
      setSubmissionError={setSubmissionError}
      formSubmissionResult={formSubmissionResult}
      handlePostSubmissionAction={handlePostSubmissionAction}
      postSubmissionActionErrorMessage={postSubmissionActionErrorMessage}
      buttons={buttons}
    />
  )
}

function ControlledFormWithAutosave({
  form,
  preFillData,
  existingDraft,
  updateDefinition,
  updateSubmission,
  autoSaveKey,
  buttons,
}: Props & { autoSaveKey: string }) {
  const [onCancel] = useCancelForm(form)

  const {
    onSubmit,
    isSubmitting,
    formSubmissionResult,
    submissionError,
    setSubmissionError,
    handlePostSubmissionAction,
    postSubmissionActionErrorMessage,
  } = useSubmitForm()

  const {
    tempDraftFormSubmissionResult,
    isSavingDraft,
    cancelSaveDraft,
    onConfirmSaveDraft,
    onSaveDraft,
    saveDraftError,
    clearSaveDraftError,
  } = useSaveDraft()

  const {
    definition,
    submission: liveSubmission,
    isLoadingAutoSaveSubmission,
    isAutoSaveSubmissionAvailable,
    startNewSubmission,
    continueAutoSaveSubmission,
    handleSubmit,
    handleCancel,
    setFormSubmission,
  } = useFormSubmissionAutoSaveState({
    form,
    initialSubmission: preFillData,
    autoSaveKey,
    onCancel,
    onSubmit,
    onSaveDraft,
  })

  const customDefinition = React.useMemo(() => {
    return updateDefinition(definition, liveSubmission)
  }, [definition, updateDefinition, liveSubmission])

  const customSetFormSubmission = React.useCallback(
    (formSubmission) => {
      setFormSubmission((currentState: FormSubmissionState) => {
        const newFormSubmission: FormSubmissionState =
          typeof formSubmission === 'function'
            ? formSubmission(currentState)
            : formSubmission

        return {
          submission: updateSubmission(
            newFormSubmission.submission,
            customDefinition,
          ),
          definition: customDefinition,
        }
      })
    },
    [setFormSubmission, updateSubmission, customDefinition],
  )

  if (isLoadingAutoSaveSubmission) {
    return <LoadingSpinner>Fetching submission</LoadingSpinner>
  }

  return (
    <React.Fragment>
      <ControlledFormBase
        form={form}
        customDefinition={customDefinition}
        liveSubmission={liveSubmission}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        onSaveDraft={onSaveDraft}
        customSetFormSubmission={customSetFormSubmission}
        existingDraft={existingDraft}
        isSavingDraft={isSavingDraft}
        saveDraftError={saveDraftError}
        clearSaveDraftError={clearSaveDraftError}
        tempDraftFormSubmissionResult={tempDraftFormSubmissionResult}
        cancelSaveDraft={cancelSaveDraft}
        onConfirmSaveDraft={onConfirmSaveDraft}
        isSubmitting={isSubmitting}
        submissionError={submissionError}
        setSubmissionError={setSubmissionError}
        formSubmissionResult={formSubmissionResult}
        handlePostSubmissionAction={handlePostSubmissionAction}
        postSubmissionActionErrorMessage={postSubmissionActionErrorMessage}
        buttons={buttons}
      />
      <Modal
        isOpen={!!isAutoSaveSubmissionAvailable}
        title="Continue?"
        actions={
          <>
            <button
              type="button"
              className="button ob-button is-light"
              onClick={startNewSubmission}
            >
              Start again
            </button>
            <button
              type="button"
              className="button ob-button is-primary"
              onClick={continueAutoSaveSubmission}
            >
              Continue
            </button>
          </>
        }
      >
        <p>
          We found an in progress submission, would you like to pick up where
          you left off or start again?
        </p>
      </Modal>
    </React.Fragment>
  )
}

type BaseProps = {
  form: FormTypes.Form
  customDefinition: FormTypes.Form
  liveSubmission: Record<string, unknown>
  handleCancel: () => void
  handleSubmit: (formDefinition: any) => void
  onSaveDraft: (draftSubmission: submissionService.NewDraftSubmission) => void
  customSetFormSubmission: (submission: any) => void
  existingDraft?: DraftAndData
  isSavingDraft: boolean
  saveDraftError?: OneBlinkAppsError
  clearSaveDraftError: () => void
  tempDraftFormSubmissionResult?: submissionService.NewDraftSubmission
  cancelSaveDraft: () => void
  onConfirmSaveDraft: OnConfirmSaveDraftType
  isSubmitting: boolean
  submissionError?: OneBlinkAppsError
  setSubmissionError: SetErrorFn
  formSubmissionResult?: submissionService.FormSubmissionResult
  handlePostSubmissionAction: (
    formSubmissionResult: submissionService.FormSubmissionResult,
  ) => void
  postSubmissionActionErrorMessage?: OneBlinkAppsError
  buttons?: Record<string, unknown>
}

function ControlledFormBase({
  form,
  customDefinition,
  liveSubmission,
  handleCancel,
  handleSubmit,
  onSaveDraft,
  customSetFormSubmission,
  existingDraft,
  isSavingDraft,
  saveDraftError,
  clearSaveDraftError,
  tempDraftFormSubmissionResult,
  cancelSaveDraft,
  onConfirmSaveDraft,
  isSubmitting,
  submissionError,
  setSubmissionError,
  formSubmissionResult,
  handlePostSubmissionAction,
  postSubmissionActionErrorMessage,
  buttons,
}: BaseProps) {
  return (
    <React.Fragment>
      <OneBlinkFormControlled
        definition={customDefinition}
        submission={liveSubmission}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        onSaveDraft={onSaveDraft}
        googleMapsApiKey={config.GOOGLE_MAP_API_KEY}
        captchaSiteKey={config.RECAPTCHA_SITE_KEY}
        buttons={buttons}
        setFormSubmission={customSetFormSubmission}
      />
      <Modal
        title={`${existingDraft ? 'Updating' : 'Saving'} Draft...`}
        isOpen={isSavingDraft}
        actions={null}
        cardClassName="has-text-centered"
      >
        <LoadingSpinner />
      </Modal>
      {!!saveDraftError && (
        <ErrorModal error={saveDraftError} onClose={clearSaveDraftError} />
      )}
      {!!tempDraftFormSubmissionResult && (
        <ConfirmSaveDraftModal
          isOpen={!isSavingDraft}
          cancelSaveDraft={cancelSaveDraft}
          handleConfirmedSaveDraft={onConfirmSaveDraft}
          tempDraftFormSubmissionResult={tempDraftFormSubmissionResult}
          defaultDraftTitle={existingDraft?.draft.title || form.name}
          existingDraft={existingDraft?.draft}
        />
      )}
      <Modal isOpen={isSubmitting} title="Submitting Form..." actions={null}>
        <LoadingSpinner />
      </Modal>
      {!!submissionError && (
        <ErrorModal
          error={submissionError}
          onClose={() => setSubmissionError(undefined)}
        />
      )}
      {formSubmissionResult && (
        <SubmissionModal
          formSubmissionResult={formSubmissionResult}
          handlePostSubmissionAction={handlePostSubmissionAction}
        />
      )}
      <Modal
        isOpen={!!postSubmissionActionErrorMessage}
        title="Sorry"
        actions={null}
      >
        <p>{postSubmissionActionErrorMessage}</p>
      </Modal>
    </React.Fragment>
  )
}

export default ControlledFormContainer
