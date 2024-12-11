export type DialogRequestType = {
  name: string,
  phone: string,
  service?: string,
  type: TypeRequest
}

export enum TypeRequest {
  order = 'order',
  consultation = 'consultation'
}
