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
import useOneBlinkError from 'hooks/useOneBlinkError'

import useViewportSizes from 'use-viewport-sizes'
import { useTheme } from 'styled-components'
import { OneBlinkAppsError } from '@oneblink/apps'

const PendingQueueHeadingContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
`
PendingQueueHeadingContainer.displayName = 'PendingQueueHeadingContainer'

const ProcessPendingQueueButtonContainer = styled.div`
  margin-left: auto;
  padding-left: 2rem;
`
ProcessPendingQueueButtonContainer.displayName =
  'ProcessPendingQueueButtonContainer'

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
    useOneBlinkError()
  const {
    pendingSubmissions,
    isLoading,
    isProcessingPendingQueue,
    processPendingQueue,
    deletePendingSubmission,
  } = usePendingSubmissions()

  //@ts-expect-error
  const [vpWidth] = useViewportSizes({ throttleTimeout: 1000 })
  const theme = useTheme()

  const handleDelete = React.useCallback(async () => {
    if (isMounted.current) {
      startDelete()
    }
    try {
      if (pendingTimestampToDelete) {
        await deletePendingSubmission(pendingTimestampToDelete)
      }
    } catch (e) {
      if (e instanceof OneBlinkAppsError) {
        setDeletePendingSubmissionError(e)
      }
    }

    if (isMounted.current) {
      unsetIdForDelete()
      endDelete()
    }
  }, [
    isMounted,
    startDelete,
    pendingTimestampToDelete,
    deletePendingSubmission,
    setDeletePendingSubmissionError,
    unsetIdForDelete,
    endDelete,
  ])

  return (
    <>
      <PendingQueueHeadingContainer>
        <H1>Pending Submissions</H1>
        <ProcessPendingQueueButtonContainer>
          {!isOffline && !!pendingSubmissions.length && (
            <button
              className="button ob-button is-primary"
              onClick={processPendingQueue}
              disabled={isProcessingPendingQueue}
            >
              {isProcessingPendingQueue ? <SyncingIcon /> : <SyncIcon />}
              {vpWidth > theme.screenSizes.phone && 'Process Submissions'}
            </button>
          )}
          {isOffline && (
            <button className="button ob-button is-primary">
              <OfflineIcon />
              Offline
            </button>
          )}
        </ProcessPendingQueueButtonContainer>
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
            onClose={() => setDeletePendingSubmissionError()}
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
