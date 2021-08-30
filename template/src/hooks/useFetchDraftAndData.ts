import React from 'react'
import { draftService } from '@oneblink/apps'
import { useIsMounted } from '@oneblink/apps-react'
import { SubmissionTypes } from '@oneblink/types'
import useOneBlinkError from './useOneBlinkError'

export default function useFetchDraftAndData(draftId?: string) {
  const [draftAndData, setDraftAndData] = React.useState<{
    draft: SubmissionTypes.FormsAppDraft
    draftData: { readonly [x: string]: unknown }
  }>()

  const [fetchDraftAndDataError, setFetchDraftAndDataError] = useOneBlinkError()

  const [isFetchingDraftAndData, setIsFetchingDraftAndData] =
    React.useState<boolean>(false)

  const isMounted = useIsMounted()

  React.useEffect(() => {
    const fetchDraftAndData = async () => {
      try {
        setIsFetchingDraftAndData(true)
        const draftAndData = await draftService.getDraftAndData(draftId)
        setDraftAndData(draftAndData || undefined)
        if (!isMounted.current) return
      } catch (e) {
        if (!isMounted.current) return
        setFetchDraftAndDataError(e)
      } finally {
        setIsFetchingDraftAndData(false)
      }
    }

    if (draftId) {
      fetchDraftAndData()
    }
  }, [isMounted, draftId, setFetchDraftAndDataError])

  return {
    draftAndData,
    fetchDraftAndDataError,
    isFetchingDraftAndData,
  }
}
