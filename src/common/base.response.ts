export interface BaseResponse<T> {
  status: number;
  data: T;
  message: string;
}

export interface BaseResponseGet<T> {
  status: number;
  data: T;
  message: string;
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
}
