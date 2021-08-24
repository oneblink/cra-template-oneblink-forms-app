import styled from 'styled-components'

import SwipeContainer from 'components/SwipeContainer'
import { submissionService, localisationService } from '@oneblink/apps'
import {
  ItemContainer,
  SubTitle,
  DeleteButton,
} from 'components/ListComponents'

const PendingDeleteButton = styled(DeleteButton)`
  margin-left: auto;
  display: flex;
`
PendingDeleteButton.displayName = 'PendingDeleteButton'

export default function PendingQueueListItem({
  pendingSubmission,
  onDelete,
  disabled,
}: {
  pendingSubmission: submissionService.PendingFormSubmission
  onDelete: () => void
  disabled: boolean
}) {
  return (
    <SwipeContainer onSwipeRight={onDelete} disabled={disabled}>
      <ItemContainer>
        <div>
          <div>
            <b>{pendingSubmission.definition.name}</b>
          </div>
          <SubTitle>
            Saved:{' '}
            {localisationService.formatDatetime(
              new Date(pendingSubmission.pendingTimestamp),
            )}
          </SubTitle>
        </div>
        <PendingDeleteButton onClick={onDelete} $disabled={disabled} />
      </ItemContainer>
    </SwipeContainer>
  )
}
