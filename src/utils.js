export const isProduction = (
  typeof process !== 'undefined' && process.env &&
  process.env.NODE_ENV === 'production'
)

export function isObject(value) {

  return typeof value === 'object' && value !== null
}

export function mapObjectValues(obj, mapFunction) {

  if (obj instanceof Array) return obj.map(mapFunction)

  if (Object.keys(obj).length === 0) return mapFunction(obj)

  return Object.assign.apply({},
    Object.keys(obj).map(key => ({
      [key]: mapFunction(obj[key], key, obj)
    }))
  )
}

export function mapObjectTreeLeaves(obj, mapFunction, keyPath) {

  const path = keyPath || []

  return mapObjectValues(obj, (val, key) => {
    if ( isObject(val) ) {
      return mapObjectTreeLeaves(val, mapFunction, [].concat(path, key))
    }
    else {
      return mapFunction(val, key, path, obj)
    }
  })
}

export function getValueByPath(obj, path) {

  let value = obj
  let keys = path.slice()

  while (keys.length) {
    value = value[keys.shift()]
  }

  return value
}
