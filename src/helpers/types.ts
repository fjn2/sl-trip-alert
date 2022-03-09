export interface DBType {
  [key: number]: DBRecordType
}

export interface DBRecordType {
  id: number,
  endpoint: string,
  expirationTime: Date,
  keys: {
    auth: string,
    p256dh: string
  },
}
