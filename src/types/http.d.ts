type ApiResponseStatus = 'success' | 'error' | 'warning';

type ApiResponse<T = undefined> = {
  data?: T;
  status: ApiResponseStatus;
  message: string | null;
  code?: string;
};

interface ValidationErrorDetail {
  message: string;
}
