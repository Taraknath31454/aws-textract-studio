import type { ApiError, ApiFailureResponse, ApiResponse } from "@/lib/contracts/api";

export class ApiServiceError extends Error implements ApiError {
  code: string;
  status?: number;

  constructor(error: ApiError) {
    super(error.message);
    this.name = "ApiServiceError";
    this.code = error.code;
    this.status = error.status;
  }
}

export function apiSuccess<T>(data: T, message?: string): ApiResponse<T> {
  return { data, success: true, message };
}

export interface ApiClient {
  request<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>>;
}

export function createApiClient(baseUrl: string | null): ApiClient {
  return {
    async request<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
      if (!baseUrl) throw new ApiServiceError({ code: "API_BASE_URL_MISSING", message: "API mode requires NEXT_PUBLIC_API_BASE_URL." });
      const response = await fetch(`${baseUrl}${path.startsWith("/") ? path : `/${path}`}`, {
        ...init,
        headers: { "Content-Type": "application/json", ...init?.headers },
      });
      const payload = await response.json().catch(() => null) as ApiResponse<T> | ApiFailureResponse | ApiError | null;
      if (!response.ok) {
        const apiError = payload && "error" in payload ? payload.error : payload && "code" in payload ? payload : null;
        throw new ApiServiceError({ code: apiError?.code ?? "API_REQUEST_FAILED", message: apiError?.message ?? `API request failed with status ${response.status}.`, status: response.status });
      }
      if (!payload || !("success" in payload) || payload.success === false) throw new ApiServiceError({ code: "INVALID_API_RESPONSE", message: "The API returned an invalid response envelope.", status: response.status });
      return payload;
    },
  };
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiServiceError) return error;
  if (error instanceof DOMException && error.name === "AbortError") return { code: "REQUEST_ABORTED", message: "The request was cancelled." };
  if (error instanceof Error) return { code: "SERVICE_ERROR", message: error.message };
  return { code: "UNKNOWN_ERROR", message: "An unexpected frontend service error occurred." };
}
