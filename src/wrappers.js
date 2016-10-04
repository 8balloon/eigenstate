export function Pure(func) {

  func.__purity = true
  return func
}

export function Impure(func) {

  func.__purity = false
  return func
}

export function Values(obj) {

  return obj
}

export function Effect(func) {

  return func
}
