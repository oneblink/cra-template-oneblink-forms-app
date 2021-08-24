import { authService, OneBlinkAppsError } from '@oneblink/apps'

export async function generateHeaders() {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  // Check auth service for a token if user is logged in
  const idToken = await authService.getIdToken()
  if (idToken) {
    headers.Authorization = `Bearer ${idToken}`
  }

  return headers
}

interface HTTPResponse<T> {
  body?: T
  status: number
}

const toStringPair = (
  searchParams: Record<string, boolean | string | number>,
): Record<string, string> => {
  return Object.keys(searchParams).reduce(
    (memo: Record<string, string>, key: string) => {
      memo[key] = searchParams[key] + ''
      return memo
    },
    {},
  )
}

async function fetchJSON<T>(
  url: string,
  options?: RequestInit,
): Promise<HTTPResponse<T>> {
  const response = await fetch(url, options)

  if (response.status === 204) {
    return {
      status: 204,
    }
  }

  const body = await response.json()
  if (response.ok) {
    return {
      body,
      status: response.status,
    }
  }

  throw new OneBlinkAppsError(body.message, {
    httpStatusCode: response.status,
  })
}

export async function getRequest<T>({
  url,
  headers,
  abortSignal,
}: {
  url: string
  headers?: Record<string, string>
  abortSignal?: AbortSignal
}) {
  return fetchJSON<T>(url, {
    method: 'GET',
    headers: headers ? headers : await generateHeaders(),
    signal: abortSignal,
  })
}

export async function searchRequest<T>({
  url,
  headers,
  searchParameters,
  abortSignal,
}: {
  url: string
  headers?: Record<string, string>
  searchParameters?: Record<string, boolean | string | number> | string
  abortSignal?: AbortSignal
}) {
  const queryStringParams =
    typeof searchParameters === 'string'
      ? searchParameters
      : new URLSearchParams(toStringPair(searchParameters || {})).toString()

  const resp = await getRequest<T>({
    url: `${url}${queryStringParams ? `?${queryStringParams}` : ''}`,
    headers,
    abortSignal,
  })
  return resp
}

export async function postRequest<OutT>({
  url,
  resource,
  abortSignal,
}: {
  url: string
  resource?: unknown
  abortSignal?: AbortSignal
}) {
  return fetchJSON<OutT>(url, {
    method: 'POST',
    headers: await generateHeaders(),
    body: JSON.stringify(resource),
    signal: abortSignal,
  })
}

export async function putRequest<OutT>({
  url,
  resource,
  abortSignal,
}: {
  url: string
  resource: unknown
  abortSignal?: AbortSignal
}) {
  return fetchJSON<OutT>(url, {
    method: 'PUT',
    headers: await generateHeaders(),
    body: JSON.stringify(resource),
    signal: abortSignal,
  })
}

export async function deleteRequest({
  url,
  abortSignal,
}: {
  url: string
  abortSignal?: AbortSignal
}): Promise<void> {
  const opts = {
    method: 'DELETE',
    headers: await generateHeaders(),
    signal: abortSignal,
  }

  const res = await fetch(url, opts)
  if (!res.ok) {
    let errorPayload
    try {
      errorPayload = await res.json()
    } catch (e) {
      errorPayload = { message: await res.text() }
    }
    throw new OneBlinkAppsError(errorPayload.message, {
      httpStatusCode: res.status,
    })
  }
}
