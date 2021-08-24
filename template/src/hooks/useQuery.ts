import * as React from 'react'
import { parse, ParsedQs } from 'qs'
import { useLocation } from 'react-router-dom'

export default function useQuery(): ParsedQs {
  const { search } = useLocation()
  return React.useMemo(
    () => parse(search, { ignoreQueryPrefix: true }),
    [search],
  )
}
