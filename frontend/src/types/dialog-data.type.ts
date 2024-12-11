export type DialogDataType = {
  numberWindow: NumberWindow,
  typeDialog: TypeDialog,
  category?: string
}

export enum NumberWindow {
  first = 'first',
  second = 'second'
}
export enum TypeDialog {
  consultation = 'consultation',
  service = 'service'
}
