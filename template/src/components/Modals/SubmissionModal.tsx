import Modal from 'components/Modal'
import CopyToClipboardButton from 'components/CopyToClipboardButton'
import { submissionService } from '@oneblink/apps'

type Props = {
  formSubmissionResult: submissionService.FormSubmissionResult
  handlePostSubmissionAction: (
    submissionResult: submissionService.FormSubmissionResult,
  ) => void
}

export default function SubmissionModal({
  formSubmissionResult,
  handlePostSubmissionAction,
}: Props) {
  return (
    <>
      <Modal
        isOpen={!!formSubmissionResult.isInPendingQueue}
        title="It looks like you're Offline"
        cardClassName="has-text-centered"
        actions={
          <button
            className="button ob-button is-primary"
            onClick={() => handlePostSubmissionAction(formSubmissionResult)}
          >
            Okay
          </button>
        }
      >
        <p>
          Submission has been saved to the pending queue, and will be submitted
          when connectivity is restored.
        </p>
        <i className="material-icons has-text-warning icon-x-large">wifi_off</i>
      </Modal>

      {!!formSubmissionResult.submissionId && (
        <Modal
          isOpen
          title="Success"
          cardClassName="has-text-centered"
          actions={
            <button
              className="button ob-button is-primary"
              onClick={() => handlePostSubmissionAction(formSubmissionResult)}
            >
              Okay
            </button>
          }
        >
          <i className="material-icons has-text-success icon-x-large">check</i>
          <div className="ob-submission-success-id">
            <p>Submission ID: {formSubmissionResult.submissionId}</p>
            <CopyToClipboardButton
              text={formSubmissionResult.submissionId}
              isInputButton
              className="button"
            />
          </div>
        </Modal>
      )}
    </>
  )
}
