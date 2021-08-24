import * as React from 'react'
import { FormTypes } from '@oneblink/types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { ItemContainer, SubTitle } from 'components/ListComponents'

interface Props {
  formDefinition: FormTypes.Form
}

const FormLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`
FormLink.displayName = 'FormLink'

const StartLink = styled(Link)`
  margin-left: auto;
`

export default function ListItem({ formDefinition }: Props) {
  return (
    <ItemContainer>
      <FormLink to={`/forms/${formDefinition.id}`}>
        <div>
          <div>
            <b>{formDefinition.name}</b>
          </div>
          <SubTitle>{formDefinition.description || '\u200b'}</SubTitle>
        </div>
      </FormLink>
      <StartLink to={`/forms/${formDefinition.id}`}>Start</StartLink>
    </ItemContainer>
  )
}
