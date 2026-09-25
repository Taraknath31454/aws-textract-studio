export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  status?: number;
}

export interface ApiFailureResponse {
  success: false;
  error: ApiError;
}

