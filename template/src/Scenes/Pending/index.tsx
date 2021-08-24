import * as React from 'react'
import {
  useIsMounted,
  useNullableState,
  useIsOffline,
  useBooleanState,
} from '@oneblink/apps-react'
import usePendingSubmissions from 'hooks/usePendingSubmissions'

import styled, { keyframes } from 'styled-components'
import { Autorenew, WifiOff } from '@styled-icons/material'

import LoadingSpinner from 'components/LoadingSpinner'
import Modal from 'components/Modal'
import ErrorModal from 'components/Modals/ErrorModal'
import { H1, P } from 'components/TextComponents'
import PendingQueueListItem from './PendingQueueListItem'

const PendingQueueHeadingContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
`
PendingQueueHeadingContainer.displayName = 'PendingQueueHeadingContainer'

const ProcessPendingQueueButton = styled.button`
  margin-left: auto;
`
ProcessPendingQueueButton.displayName = 'ProcessPendingQueueButton'

const OfflineIcon = styled(WifiOff)`
  height: 1.4rem;
  margin-right: 0.3rem;
`
OfflineIcon.displayName = 'OfflineIcon'

const SyncIcon = styled(Autorenew)`
  height: 1.4rem;
  margin-right: 0.3rem;
`
SyncIcon.displayName = 'SyncIcon'

const spin = keyframes`
  100% {
    transform:rotate(360deg); 
  }
`

const SyncingIcon = styled(Autorenew)`
  height: 1.4rem;
  margin-right: 0.3rem;
  animation: ${spin} 2s linear infinite;
`
SyncingIcon.displayName = 'SyncingIcon'

export default function Pending() {
  const isMounted = useIsMounted()
  const [isDeleting, startDelete, endDelete] = useBooleanState(false)
  const isOffline = useIsOffline()

  const [pendingTimestampToDelete, setIdForDelete, unsetIdForDelete] =
    useNullableState<string>(null)
  const [deletePendingSubmissionError, setDeletePendingSubmissionError] =
    React.useState<Error | null>(null)
  const {
    pendingSubmissions,
    isLoading,
    isProcessingPendingQueue,
    processPendingQueue,
    deletePendingSubmission,
  } = usePendingSubmissions()

  const handleDelete = React.useCallback(async () => {
    if (isMounted.current) {
      startDelete()
    }
    try {
      if (pendingTimestampToDelete) {
        await deletePendingSubmission(pendingTimestampToDelete)
      }
    } catch (e) {
      setDeletePendingSubmissionError(e)
    }

    if (isMounted.current) {
      unsetIdForDelete()
      endDelete()
    }
  }, [
    unsetIdForDelete,
    deletePendingSubmission,
    isMounted,
    pendingTimestampToDelete,
    endDelete,
    startDelete,
  ])

  return (
    <>
      <PendingQueueHeadingContainer>
        <H1>Pending Submissions</H1>
        {!isOffline && !!pendingSubmissions.length && (
          <ProcessPendingQueueButton
            className="button ob-button is-primary"
            onClick={processPendingQueue}
            disabled={isProcessingPendingQueue}
          >
            {isProcessingPendingQueue ? <SyncingIcon /> : <SyncIcon />}
            Process Submissions
          </ProcessPendingQueueButton>
        )}
        {isOffline && (
          <ProcessPendingQueueButton className="button ob-button is-primary">
            <OfflineIcon />
            Offline
          </ProcessPendingQueueButton>
        )}
      </PendingQueueHeadingContainer>
      <>
        {isLoading && (
          <LoadingSpinner>Retrieving pending submissions...</LoadingSpinner>
        )}

        {!isLoading && !!pendingSubmissions.length ? (
          pendingSubmissions?.map((pendingSubmission) => (
            <PendingQueueListItem
              key={pendingSubmission.pendingTimestamp}
              pendingSubmission={pendingSubmission}
              onDelete={() =>
                setIdForDelete(pendingSubmission.pendingTimestamp)
              }
              disabled={isDeleting}
            />
          ))
        ) : (
          <P>There are no submissions to process at this time</P>
        )}

        {!!deletePendingSubmissionError && (
          <ErrorModal
            error={deletePendingSubmissionError}
            onClose={() => setDeletePendingSubmissionError(null)}
          />
        )}
        {isDeleting && (
          <Modal
            isOpen={isDeleting}
            title="Deleting Pending Submission"
            cardClassName="has-text-centered"
            actions={null}
          >
            <LoadingSpinner />
          </Modal>
        )}
        <Modal
          isOpen={!!pendingTimestampToDelete}
          title="Delete Pending Submission"
          actions={
            <>
              <button
                type="button"
                className="button ob-button is-light"
                onClick={() => unsetIdForDelete()}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button ob-button is-primary"
                onClick={() => pendingTimestampToDelete && handleDelete()}
                disabled={isDeleting}
              >
                Delete
              </button>
            </>
          }
        >
          <p>Are you sure you wish to delete this pending Submission?</p>
        </Modal>
      </>
    </>
  )
}
