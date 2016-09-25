import objectAssign from 'object-assign'

function mapObjectValues(obj, mapFunction) {

  if (obj instanceof Array) return obj.map(mapFunction)

  return objectAssign.apply({},
    Object.keys(obj).map(key => ({
      [key]: mapFunction(obj[key], key, obj)
    }))
  )
}

export function mapObjectTreeLeaves(obj, mapFunction, keyPath) {

  const path = keyPath || []

  return mapObjectValues(obj, (val, key) => {
    if ( (val instanceof Object) && !(val instanceof Function) && !(val === null)) {
      return mapObjectTreeLeaves(val, mapFunction, [].concat(path, key))
    }
    else {
      return mapFunction(val, key, path, obj)
    }
  })
}

export function getValueByPath(obj, path) {

  var value = obj
  var keys = path.slice()

  while (keys.length) {
    value = value[keys.shift()]
  }

  return value
}

//mutates obj
export function mutSetValueByPath(obj, path, value) {

  if (!path.length) return value

  var parent = obj
  var keysTo = path.slice(0, -1)
  const keyOf = path[path.length - 1]

  while (keysTo.length) {
    parent = parent[keysTo.shift()]
  }

  parent[keyOf] = value

  return obj
}
