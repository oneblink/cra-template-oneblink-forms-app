import * as React from 'react'
import { SubmissionTypes } from '@oneblink/types'
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

  return (
    <SwipeContainer onSwipeRight={onDelete} disabled={disabled}>
      <ItemContainer>
        <div>
          <div>
            <b>{draft.title}</b>
          </div>
          <SubTitle>Saved: {draft.updatedAt}</SubTitle>
        </div>
        <ButtonsContainer>
          <DeleteButton onClick={onDelete} $disabled={disabled} />
          <Link to={resumeLink}>Resume</Link>
        </ButtonsContainer>
      </ItemContainer>
    </SwipeContainer>
  )
}
