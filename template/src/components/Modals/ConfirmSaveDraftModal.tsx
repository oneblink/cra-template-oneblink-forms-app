import * as React from 'react'
import { submissionService } from '@oneblink/apps'
import { SubmissionTypes } from '@oneblink/types'
import Modal from 'components/Modal'
import { OnConfirmSaveDraftType } from '../../hooks/useSaveDraft'

type Props = {
  isOpen: boolean
  cancelSaveDraft: () => void
  handleConfirmedSaveDraft: OnConfirmSaveDraftType
  tempDraftFormSubmissionResult: submissionService.NewDraftSubmission
  defaultDraftTitle: string
  existingDraft?: SubmissionTypes.FormsAppDraft
}

export default function ConfirmSaveDraftModal({
  isOpen,
  cancelSaveDraft,
  handleConfirmedSaveDraft,
  tempDraftFormSubmissionResult,
  defaultDraftTitle,
  existingDraft,
}: Props) {
  const [draftTitle, setDraftTitle] = React.useState<string>(
    defaultDraftTitle || '',
  )

  return (
    <Modal
      isOpen={isOpen}
      title="Draft Title"
      actions={
        <>
          <button
            type="button"
            className="button ob-button is-light"
            onClick={cancelSaveDraft}
          >
            Cancel
          </button>
          <button
            type="button"
            className="button ob-button is-primary"
            onClick={() =>
              handleConfirmedSaveDraft(
                tempDraftFormSubmissionResult,
                draftTitle,
                existingDraft,
              )
            }
          >
            Save
          </button>
        </>
      }
    >
      <input
        className="input ob-draft-title"
        value={draftTitle}
        onChange={(e) => setDraftTitle(e.target.value)}
      />
    </Modal>
  )
}
