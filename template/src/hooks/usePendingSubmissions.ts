import * as React from 'react'
import { submissionService } from '@oneblink/apps'
import { useIsMounted, useIsOffline } from '@oneblink/apps-react'

const defaultState = {
  isLoading: false,
  loadError: null,
  pendingSubmissions: [],
}

export default function usePendingSubmissions() {
  const isMounted = useIsMounted()
  const isOffline = useIsOffline()

  const [isProcessingPendingQueue, setIsProcessingPendingQueue] =
    React.useState(false)
  const [state, setState] = React.useState<{
    isLoading: boolean
    loadError: Error | null
    pendingSubmissions: submissionService.PendingFormSubmission[]
  }>(defaultState)

  const processPendingQueue = React.useCallback(async () => {
    if (isMounted.current) {
      setIsProcessingPendingQueue(true)
    }

    await submissionService.processPendingQueue()

    if (isMounted.current) {
      setIsProcessingPendingQueue(false)
    }
  }, [isMounted])

  const reloadPendingSubmissions = React.useCallback(async () => {
    if (isMounted.current) {
      setState((currentState) => ({
        isLoading: true,
        loadError: null,
        pendingSubmissions: currentState.pendingSubmissions,
      }))
    }
    let newError = null
    let newPendingSubmissions: submissionService.PendingFormSubmission[] = []

    try {
      newPendingSubmissions =
        await submissionService.getPendingQueueSubmissions()
    } catch (error) {
      newError = error
    }

    if (isMounted.current) {
      setState({
        isLoading: false,
        loadError: newError,
        pendingSubmissions: newPendingSubmissions,
      })
    }
  }, [isMounted])

  const value = React.useMemo(
    () => ({
      ...state,
      isProcessingPendingQueue,
      processPendingQueue,
      reloadPendingSubmissions,
      deletePendingSubmission: submissionService.deletePendingQueueSubmission,
    }),
    [
      state,
      reloadPendingSubmissions,
      isProcessingPendingQueue,
      processPendingQueue,
    ],
  )

  React.useEffect(() => {
    reloadPendingSubmissions()
    return submissionService.registerPendingQueueListener(
      (pendingSubmissions) => {
        setState({
          isLoading: false,
          pendingSubmissions,
          loadError: null,
        })
      },
    )
  }, [reloadPendingSubmissions])

  React.useEffect(() => {
    if (!isOffline) {
      processPendingQueue()
    }
  }, [isOffline, processPendingQueue])

  return value
}
