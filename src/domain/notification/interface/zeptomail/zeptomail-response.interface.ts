export interface ZeptoMailResponse {
  data: {
    code: string;
    additional_info: any[];
    message: string;
  }[];
  message: string;
  request_id: string;
  object: string;
}
