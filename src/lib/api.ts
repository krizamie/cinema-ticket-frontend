import { getAuthToken } from "@/lib/auth"
import { API_URL } from "@/lib/config"

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown
}

export class ApiError extends Error {
  readonly status: number
  readonly details: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.details = details
  }
}

function getErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === "string" && data.trim()) {
    return data
  }

  if (typeof data === "object" && data !== null) {
    const body = data as Record<string, unknown>
    const message = body.message ?? body.error

    if (typeof message === "string" && message.trim()) {
      return message
    }
  }

  return fallback
}

function isFormData(body: unknown): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData
}

async function readResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined
  }

  const text = await response.text()

  if (!text) {
    return undefined
  }

  const contentType = response.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase()
  if (contentType === "application/json" || contentType?.endsWith("+json")) {
    try {
      return JSON.parse(text) as unknown
    } catch (error) {
      throw new ApiError("The server returned invalid JSON.", response.status, error)
    }
  }

  return text
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { body, headers: requestHeaders, ...requestOptions } = options
  const headers = new Headers(requestHeaders)

  headers.set("Accept", "application/json")

  if (body !== undefined && !isFormData(body)) {
    headers.set("Content-Type", "application/json")
  }

  const token = getAuthToken()
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const isSameOriginApiPath =
    normalizedPath === "/api" || normalizedPath.startsWith("/api/")
  const requestUrl = isSameOriginApiPath
    ? normalizedPath
    : `${API_URL.replace(/\/+$/, "")}${normalizedPath}`
  const response = await fetch(requestUrl, {
    ...requestOptions,
    headers,
    body:
      body === undefined
        ? undefined
        : isFormData(body)
          ? body
          : JSON.stringify(body),
  })

  const responseBody = await readResponseBody(response)

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(responseBody, `Request failed with status ${response.status}.`),
      response.status,
      responseBody,
    )
  }

  return responseBody as T
}

export function get<T>(path: string, options: Omit<ApiRequestOptions, "method" | "body"> = {}) {
  return apiRequest<T>(path, { ...options, method: "GET" })
}

export function post<T>(
  path: string,
  body?: unknown,
  options: Omit<ApiRequestOptions, "method" | "body"> = {},
) {
  return apiRequest<T>(path, { ...options, method: "POST", body })
}

export function put<T>(
  path: string,
  body?: unknown,
  options: Omit<ApiRequestOptions, "method" | "body"> = {},
) {
  return apiRequest<T>(path, { ...options, method: "PUT", body })
}

export function patch<T>(
  path: string,
  body?: unknown,
  options: Omit<ApiRequestOptions, "method" | "body"> = {},
) {
  return apiRequest<T>(path, { ...options, method: "PATCH", body })
}

export function del<T>(
  path: string,
  options: Omit<ApiRequestOptions, "method" | "body"> = {},
) {
  return apiRequest<T>(path, { ...options, method: "DELETE" })
}
