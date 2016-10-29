export const isProduction = (
  typeof process !== 'undefined' && process.env &&
  process.env.NODE_ENV === 'production'
)

export function isObject(value) {

  return typeof value === 'object' && value !== null
}

export function mapObjectValues(obj, mapFunc) {

  if (Object.keys(obj).length === 0) return mapFunc(obj)

  if (obj instanceof Array) return obj.map(mapFunc)

  return Object.assign.apply({},
    Object.keys(obj).map(key => ({
      [key]: mapFunc(obj[key], key, obj)
    }))
  )
}

export function mapObjectTreeLeaves(obj, mapFunc, keyPath) {

  if (obj === undefined) return

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

export function getValueByPath(obj, path) {

  let value = obj
  let keys = path.slice()

  while (keys.length) {
    value = value[keys.shift()]
  }

  return value
}
