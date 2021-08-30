import styled from 'styled-components'
import { Delete } from '@styled-icons/material'

export const ItemContainer = styled.div`
  border-bottom: solid 1px ${({ theme }) => theme.palette.lightgrey};
  display: flex;
  padding: 0.5rem;
  width: 100%;
  align-items: center;
`
ItemContainer.displayName = 'ItemContainer'

export const SubTitle = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.palette.grey};
`
SubTitle.displayName = 'SubTitle'

export const DeleteButton = styled(Delete)<{ $disabled: boolean }>`
  height: 1.5rem;
  padding: 0 0.75rem;
  cursor: pointer;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'all')};
`
DeleteButton.displayName = 'DeleteButton'