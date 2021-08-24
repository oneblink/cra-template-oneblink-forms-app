import * as React from 'react'
import { draftService } from '@oneblink/apps'
import { useBooleanState } from '@oneblink/apps-react'
import { SubmissionTypes } from '@oneblink/types'
import styled, { keyframes } from 'styled-components'
import { Autorenew } from '@styled-icons/material'

import ErrorMessage from 'components/ErrorMessage'
import LoadingSpinner from 'components/LoadingSpinner'
import Modal from 'components/Modal'
import ErrorModal from 'components/Modals/ErrorModal'
import { H1, P } from 'components/TextComponents'
import DraftsListItem from './DraftsListItem'

import config from '../../config'

const DraftsHeaderContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
`
DraftsHeaderContainer.displayName = 'DraftsHeaderContainer'

const SyncDraftsButton = styled.button`
  margin-left: auto;
`
SyncDraftsButton.displayName = 'SyncDraftsButton'

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

export default function Drafts() {
  const [drafts, setDrafts] = React.useState<SubmissionTypes.FormsAppDraft[]>()
  const [isSyncingDrafts, startSync, endSync] = useBooleanState(false)
  const [syncDraftsError, setSyncDraftsError] = React.useState<Error | null>(
    null,
  )
  const [deleteDraftError, setDeleteDraftError] = React.useState<Error | null>(
    null,
  )
  const [draftIdForDelete, setDraftIdForDelete] = React.useState<string>()
  const [isDeleting, startDelete, endDelete] = useBooleanState(false)

  const formsAppId = config.OB_FORMS_APP_ID

  const syncDrafts = React.useCallback(async () => {
    startSync()
    setSyncDraftsError(null)
    try {
      await draftService.syncDrafts({
        formsAppId: formsAppId,
        throwError: true,
      })
      const drafts = await draftService.getDrafts()
      setDrafts(drafts)
    } catch (e) {
      console.error(e)
      setSyncDraftsError(e)
    } finally {
      endSync()
    }
  }, [formsAppId, startSync, endSync])

  const deleteDraft = React.useCallback(
    async (draftId: string) => {
      try {
        startDelete()
        await draftService.deleteDraft(draftId, formsAppId)
      } catch (e) {
        console.error(e)
        setDeleteDraftError(e)
      } finally {
        setDraftIdForDelete(undefined)
        endDelete()
        syncDrafts()
      }
    },
    [formsAppId, syncDrafts, endDelete, startDelete],
  )

  React.useEffect(() => {
    syncDrafts()
  }, [syncDrafts])

  return (
    <div>
      <DraftsHeaderContainer>
        <H1>Drafts</H1>
        <SyncDraftsButton
          className="button ob-button is-primary"
          onClick={syncDrafts}
          disabled={isSyncingDrafts}
        >
          {isSyncingDrafts ? <SyncingIcon /> : <SyncIcon />}
          Sync Drafts
        </SyncDraftsButton>
      </DraftsHeaderContainer>
      <div>
        {!isSyncingDrafts && syncDraftsError && (
          <ErrorMessage>
            An error has occurred while attempting to sync drafts: {syncDraftsError}
          </ErrorMessage>
        )}
        {!syncDraftsError && drafts?.map((draft) => (
          <DraftsListItem
            draft={draft}
            key={draft.draftId}
            onDelete={() => setDraftIdForDelete(draft.draftId)}
            disabled={isSyncingDrafts}
          />
        ))}
        {drafts?.length === 0 && <P>You have no drafts</P>}
        {!!deleteDraftError && (
          <ErrorModal
            error={deleteDraftError}
            onClose={() => setDeleteDraftError(null)}
          />
        )}
        {isDeleting && (
          <Modal
            isOpen={isDeleting}
            title="Deleting Draft"
            cardClassName="has-text-centered"
            actions={null}
          >
            <LoadingSpinner />
          </Modal>
        )}
        <Modal
          isOpen={!!draftIdForDelete}
          title="Delete Draft"
          actions={
            <>
              <button
                type="button"
                className="button ob-button is-light"
                onClick={() => setDraftIdForDelete(undefined)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button ob-button is-primary"
                onClick={() =>
                  draftIdForDelete && deleteDraft(draftIdForDelete)
                }
                disabled={isDeleting}
              >
                Delete
              </button>{' '}
            </>
          }
        >
          <p>Are you sure you wish to delete this draft?</p>
        </Modal>
      </div>
    </div>
  )
}
