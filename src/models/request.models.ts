import type { AxiosRequestConfig } from "axios"

/** Envelope chuẩn của backend KimTV. */
interface ApiEnvelopeInterface<T> {
  status: "success" | "fail" | string
  result: T
  errorCode: number | null
  errorMsg: string | null
  message: string | null
  time: number | null
}

/**
 * Kết quả trả về của mọi helper — luôn resolve, không bao giờ throw.
 * `message` != null nghĩa là caller NÊN hiển thị thông báo cho user.
 */
interface RequestResultInterface<T> {
  success: boolean
  data: T | null
  message: string | null
  errorCode: number | null
  httpStatus: number
}

/** Option cho mỗi request: gồm config axios + điều khiển message thông báo. */
interface RequestOptionsInterface extends AxiosRequestConfig {
  /** Message hiển thị khi thành công. */
  successMessage?: string
  /** Message hiển thị khi lỗi (override message mặc định từ server). */
  errorMessage?: string
  /** Có hiển thị message khi thành công không (mặc định: false). */
  showSuccess?: boolean
  /** Có hiển thị message khi lỗi không (mặc định: true). */
  showError?: boolean
}

/** Lỗi chuẩn hóa nội bộ — gói status/message/code. */
interface NormalizedErrorInterface {
  message: string
  httpStatus: number
  errorCode: number | null
}

export type {
  ApiEnvelopeInterface,
  RequestResultInterface,
  RequestOptionsInterface,
  NormalizedErrorInterface,
}
