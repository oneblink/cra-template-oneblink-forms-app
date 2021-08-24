import * as React from 'react'
import styled from 'styled-components'

import { useFormsDefinitions } from 'Providers/FormDefinitionProvider'
import ListItem from './ListItem'

const ListContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
`
ListContainer.displayName = 'ListContainer'

export default function FormsList() {
  const { forms } = useFormsDefinitions()

  if (!forms) return <p>There are no forms available, try logging in.</p>
  return (
    <ListContainer>
      {forms.map((formDefinition) => {
        return (
          <ListItem formDefinition={formDefinition} key={formDefinition.id} />
        )
      })}
    </ListContainer>
  )
}
