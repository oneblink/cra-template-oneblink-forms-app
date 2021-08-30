import React from 'react'
import { useBooleanState, useNullableState } from '@oneblink/apps-react'
import { SubmissionTypes } from '@oneblink/types'
import { draftService } from '@oneblink/apps'

export default function useFetchDrafts() {
  const [drafts, setDrafts] = React.useState<SubmissionTypes.FormsAppDraft[]>()
  const [isFetchingDrafts, startFetchingDrafts, doneFetchingDrafts] =
    useBooleanState(false)
  const [fetchDraftsError, setFetchDraftsError] = useNullableState<Error>(null)

  React.useEffect(() => {
    startFetchingDrafts()
    draftService
      .getDrafts()
      .then(setDrafts, setFetchDraftsError)
      .finally(doneFetchingDrafts)
  }, [setDrafts, startFetchingDrafts, doneFetchingDrafts, setFetchDraftsError])

  return {
    isFetchingDrafts,
    drafts,
    fetchDraftsError,
  }
}
