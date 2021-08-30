import * as React from 'react'
import { submissionService } from '@oneblink/apps'
import { useIsMounted, useIsOffline } from '@oneblink/apps-react'
import useOneBlinkError from './useOneBlinkError'

const defaultState = {
  isLoading: false,
  pendingSubmissions: [],
}

export default function usePendingSubmissions() {
  const isMounted = useIsMounted()
  const isOffline = useIsOffline()
  const [loadError, setLoadError] = useOneBlinkError()

  const [isProcessingPendingQueue, setIsProcessingPendingQueue] =
    React.useState(false)
  const [state, setState] = React.useState<{
    isLoading: boolean
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
        pendingSubmissions: currentState.pendingSubmissions,
      }))
    }
    let newError
    let newPendingSubmissions: submissionService.PendingFormSubmission[] = []

    try {
      newPendingSubmissions =
        await submissionService.getPendingQueueSubmissions()
    } catch (error) {
      newError = error
    }

    if (isMounted.current) {
      setLoadError(newError)
      setState({
        isLoading: false,
        pendingSubmissions: newPendingSubmissions,
      })
    }
  }, [isMounted, setLoadError])

  const value = React.useMemo(
    () => ({
      ...state,
      loadError,
      isProcessingPendingQueue,
      processPendingQueue,
      reloadPendingSubmissions,
      deletePendingSubmission: submissionService.deletePendingQueueSubmission,
    }),
    [
      state,
      loadError,
      isProcessingPendingQueue,
      processPendingQueue,
      reloadPendingSubmissions,
    ],
  )

  React.useEffect(() => {
    reloadPendingSubmissions()
    return submissionService.registerPendingQueueListener(
      (pendingSubmissions) => {
        setLoadError()
        setState({
          isLoading: false,
          pendingSubmissions,
        })
      },
    )
  }, [reloadPendingSubmissions, setLoadError])

  React.useEffect(() => {
    if (!isOffline) {
      processPendingQueue()
    }
  }, [isOffline, processPendingQueue])

  return value
}
