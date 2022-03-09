import { DBType, DBRecordType } from './types'
// DB methods
const db: DBType = {}
let dbId = 0

const saveSubscriptionToDatabase = (data: DBRecordType) => {
  dbId ++;

  data.id = dbId
  db[dbId] = data

  console.log('New record', dbId)

  return Promise.resolve(dbId)
}
const getByEndpointName = (endpoint) => {
  return Object.keys(db).find((key) => {
    const item = db[key]
    return item.endpoint === endpoint
  })
}

export default {
  saveSubscriptionToDatabase,
  getByEndpointName
}