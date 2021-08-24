import * as React from 'react'
import clsx from 'clsx'
import { OneBlinkAppsError } from '@oneblink/apps'
import OneBlinkAppsErrorOriginalMessage from '@oneblink/apps-react/dist/components/OneBlinkAppsErrorOriginalMessage'

import Modal from 'components/Modal'

type Props = {
  error: OneBlinkAppsError | Error | null
  closeButtonLabel?: string
  closeButtonClassName?: string
  onClose: () => unknown
}

function ErrorModal({
  error,
  closeButtonLabel,
  closeButtonClassName,
  onClose,
}: Props) {
  if (!error) {
    return null
  }

  let displayError

  if (!(error instanceof OneBlinkAppsError)) {
    displayError = new OneBlinkAppsError(error.message)
  } else {
    displayError = error
  }

  return (
    <Modal
      isOpen
      title={displayError.title}
      cardClassName={clsx({
        'has-text-centered': displayError.isOffline,
      })}
      actions={
        <>
          <button
            type="button"
            className={clsx(
              'button ob-button is-primary',
              closeButtonClassName,
            )}
            onClick={onClose}
          >
            {closeButtonLabel || 'Okay'}
          </button>
        </>
      }
    >
      <>
        <p>{error.message}</p>
        {displayError.isOffline && (
          <i className="material-icons has-text-warning icon-x-large">
            wifi_off
          </i>
        )}
        <OneBlinkAppsErrorOriginalMessage error={displayError.originalError} />
      </>
    </Modal>
  )
}

export default ErrorModal
