import React from 'react'
import { OneBlinkAppsError } from '@oneblink/apps'

export type SetErrorFn = (e?: Error | OneBlinkAppsError | string) => void

export default function useOneBlinkError(): [
  OneBlinkAppsError | undefined,
  SetErrorFn,
] {
  const [message, _setMessage] = React.useState<OneBlinkAppsError>()

  const setMessage = React.useCallback(
    (e?: Error | OneBlinkAppsError | string) => {
      e && console.error(e)

      if (e === undefined || e instanceof OneBlinkAppsError) {
        _setMessage(e)
      } else {
        _setMessage(
          new OneBlinkAppsError(typeof e === 'string' ? e : e.message),
        )
      }
    },
    [],
  )

  return [message, setMessage]
}
