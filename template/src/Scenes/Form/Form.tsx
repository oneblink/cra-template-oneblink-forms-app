import React from 'react'
import { OneBlinkForm, OneBlinkAutoSaveForm } from '@oneblink/apps-react'
import { FormTypes } from '@oneblink/types'

import config from '../../config'
import LoadingSpinner from 'components/LoadingSpinner'
import useSubmitForm from 'hooks/useSubmitForm'
import useSaveDraft from '../../hooks/useSaveDraft'
import useCancelForm from 'hooks/useCancelForm'

import Modal from 'components/Modal'
import ErrorModal from 'components/Modals/ErrorModal'
import SubmissionModal from 'components/Modals/SubmissionModal'
import ConfirmSaveDraftModal from 'components/Modals/ConfirmSaveDraftModal'

type Props = {
  form: FormTypes.Form
  preFillData: Record<string, unknown>
  autoSaveKey?: string
  existingDraft?: DraftAndData
}

function Form({ form, preFillData, autoSaveKey, existingDraft }: Props) {
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
    onSaveDraft,
    tempDraftFormSubmissionResult,
    isSavingDraft,
    cancelSaveDraft,
    onConfirmSaveDraft,
    saveDraftError,
    clearSaveDraftError,
  } = useSaveDraft()

  const [onCancel] = useCancelForm(form)

  return (
    <React.Fragment>
      {autoSaveKey ? (
        <OneBlinkAutoSaveForm
          form={form}
          onCancel={onCancel}
          onSubmit={onSubmit}
          onSaveDraft={onSaveDraft}
          googleMapsApiKey={config.GOOGLE_MAP_API_KEY}
          captchaSiteKey={config.RECAPTCHA_SITE_KEY}
          initialSubmission={preFillData}
          buttons={{}}
          autoSaveKey={autoSaveKey}
        />
      ) : (
        <OneBlinkForm
          form={form}
          onCancel={onCancel}
          onSubmit={onSubmit}
          onSaveDraft={onSaveDraft}
          googleMapsApiKey={config.GOOGLE_MAP_API_KEY}
          captchaSiteKey={config.RECAPTCHA_SITE_KEY}
          initialSubmission={preFillData}
          buttons={{}}
        />
      )}
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
          onClose={() => setSubmissionError(null)}
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

export default Form
