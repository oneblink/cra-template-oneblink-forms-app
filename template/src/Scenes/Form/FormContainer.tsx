import React from 'react'
import { useParams } from 'react-router-dom'

import useFetchForm from '../../hooks/useFetchForm'
import useQuery from '../../hooks/useQuery'
import useFetchDraftAndData from '../../hooks/useFetchDraftAndData'
import { useAppStyles } from 'Providers/AppStylesProvider'

import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'

import DefaultForm from './Form'
import ControlledForm from './ControlledForm'

import { FormTypes } from '@oneblink/types'

import styled from 'styled-components'
import { autoSaveService } from '@oneblink/apps'

const FormWrapper = styled.div`
  width: 100%;
`
FormWrapper.displayName = 'FormWrapper'

function Form({
  formDefinition,
  preFillData,
  existingDraft,
}: {
  formDefinition: FormTypes.Form
  preFillData: Record<string, unknown>
  existingDraft?: DraftAndData
}) {
  const { buttons } = useAppStyles()
  /*  
    Two 'Types' of form components are available, the default uncontrolled form, and a controlled form.
    The controlled form can be used for on the fly programmatic access to the definition and submission,
    allowing you to read and modify both of these properties reactively.

    See: https://github.com/oneblink/apps-react/blob/master/docs/OneBlinkFormControlled.md for more information.

    Below is one way to achieve the use of both types of forms, using the form ID to determine whether you wish to load the form as a controlled or uncontrolled form.
  */
  switch (formDefinition.id) {
    case 1:
      return (
        <ControlledForm
          form={formDefinition}
          preFillData={preFillData}
          existingDraft={existingDraft}
          buttons={buttons}
          updateDefinition={(definition) => {
            /* 
              Here you may update the form definition programatically.
              The form submission is also accessible as the second parameter, after definition
            */

            return definition
          }}
          updateSubmission={(submission) => {
            /* 
              Here you may update the form submission programatically.
              The form definition is also accessible as the second parameter, after submission
            */

            return submission
          }}
        />
      )
    default:
      return (
        <DefaultForm
          form={formDefinition}
          preFillData={preFillData}
          existingDraft={existingDraft}
          buttons={buttons}
        />
      )
  }
}

export default function FormContainer() {
  const params = useParams<{ formId: string }>()
  const formId = parseInt(params.formId)
  const query = useQuery()

  const draftId = query?.draftId?.toString()

  React.useEffect(() => {
    const removeAutosave = async () => {
      if (draftId) {
        // resuming a draft, remove autosave if there is one
        await autoSaveService.deleteAutoSaveData(formId, null)
      }
    }

    removeAutosave()
  }, [draftId, formId])

  const [preFillError, setPreFillError] = React.useState<boolean>(false)
  const [preFillData, setPreFillData] = React.useState<Record<string, unknown>>(
    {},
  )

  const { formDefinition, fetchFormError, isFetchingForm } =
    useFetchForm(formId)

  const { draftAndData, isFetchingDraftAndData, fetchDraftAndDataError } =
    useFetchDraftAndData(draftId)

  React.useEffect(() => {
    setPreFillError(false)

    try {
      if (query) {
        const queryStringPreFillData =
          typeof query.preFillData === 'string'
            ? JSON.parse(query.preFillData)
            : {}
        setPreFillData({
          ...draftAndData?.draftData,
          ...queryStringPreFillData,
        })
      }
    } catch (e) {
      console.error(e)
      setPreFillError(true)
    }
  }, [query, draftAndData])

  if (isFetchingForm || isFetchingDraftAndData) {
    return <LoadingSpinner>Fetching data</LoadingSpinner>
  }

  if (fetchFormError || fetchDraftAndDataError) {
    return (
      <ErrorMessage>
        An error has occurred while attempting to load this form
      </ErrorMessage>
    )
  }

  if (!formDefinition) {
    return <ErrorMessage>Unable to find form</ErrorMessage>
  }

  if (preFillError) {
    return (
      <ErrorMessage>
        The prefill data embedded in the current URL is malformed or does not
        match the current form.
      </ErrorMessage>
    )
  }

  return (
    <FormWrapper className={formDefinition.description}>
      <Form
        formDefinition={formDefinition}
        preFillData={preFillData}
        existingDraft={draftAndData}
      />
    </FormWrapper>
  )
}
