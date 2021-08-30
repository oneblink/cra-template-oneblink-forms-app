import * as React from 'react'
import { SubmissionTypes } from '@oneblink/types'
import { localisationService } from '@oneblink/apps'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import {
  ItemContainer,
  SubTitle,
  DeleteButton,
} from 'components/ListComponents'

import SwipeContainer from 'components/SwipeContainer'

const ButtonsContainer = styled.div`
  margin-left: auto;
  display: flex;
  align-items: flex-end;
  margin-bottom: 0.5rem;
`
ButtonsContainer.displayName = 'ButtonsContainer'

export default function DraftsListItem({
  draft,
  onDelete,
  disabled,
}: {
  draft: SubmissionTypes.FormsAppDraft
  onDelete: () => void
  disabled: boolean
}) {
  const resumeLink = `/forms/${draft.formId}?draftId=${draft.draftId}`

  const draftDate = React.useMemo(() => {
    const d = new Date(draft.updatedAt)
    return localisationService.formatDatetime(d)
  },[draft.updatedAt])

  return (
    <SwipeContainer onSwipeRight={onDelete} disabled={disabled}>
      <ItemContainer>
        <div>
          <div>
            <b>{draft.title}</b>
          </div>
          <SubTitle>Saved: {draftDate}</SubTitle>
        </div>
        <ButtonsContainer>
          <DeleteButton onClick={onDelete} $disabled={disabled} />
          <Link to={resumeLink}>Resume</Link>
        </ButtonsContainer>
      </ItemContainer>
    </SwipeContainer>
  )
}
