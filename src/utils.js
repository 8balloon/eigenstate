import objectAssign from 'object-assign'

export function isObject(value) {

  return (value instanceof Object) && !(value instanceof Function) && !(value === null)
}

export function isFunction(value) {

  return value instanceof Function
}

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
    if ( isObject(val) ) {
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

export function graftState(novelTree, stateTree) {

  for (var stateKey in stateTree) {
    if (stateKey in novelTree) {

      var novelVal = novelTree[stateKey]
      if (novelVal instanceof Function) continue
      var stateVal = stateTree[stateKey]

      if (novelVal.constructor === stateVal.constructor) {
        if (typeof novelVal === 'object' && novelVal !== null) {
          graftState(novelVal, stateVal)
        }
        else {
          novelTree[stateKey] = stateVal
        }
      }
    }
  }
}
