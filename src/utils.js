export const isProduction = (
  typeof process !== 'undefined' && process.env &&
  process.env.NODE_ENV === 'production'
)

export function isObject(value) {

  return typeof value === 'object' && value !== null && !(value instanceof Function)
}

export function mapObjectValues(obj, mapFunc) {

  if (obj instanceof Array) return obj.map(mapFunc)

  return Object.assign.apply({},
    Object.keys(obj).map(key => ({
      [key]: mapFunc(obj[key], key, obj)
    }))
  )
}

export function mapObjectTreeLeaves(obj, mapFunc, keyPath) {

  if (!(isObject(obj))) return mapFunc(obj)

  const path = keyPath || []

  return mapObjectValues(obj, (val, key) => {
    if ( isObject(val) ) {
      return mapObjectTreeLeaves(val, mapFunc, [].concat(path, key))
    }
    else {
      return mapFunc(val, key, path, obj)
    }
  })
}
