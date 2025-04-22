export function isNumber(val) {
  return Object.prototype.toString.call(val) === '[object Number]'
}
export function isObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]'
}
export function isFunction(val) {
  return Object.prototype.toString.call(val) === '[object Function]'
}
export function isArray(val) {
  return Object.prototype.toString.call(val) === '[object Array]'
}
export function isString(val) {
  return Object.prototype.toString.call(val) === '[object String]'
}
export function isEmpty(val) {
  let ret = false
  if (isString(val) && val.trim().length == 0) {
    ret = true
  }
  if (isString(val) && val == 'NaN') {
    ret = true
  }
  if (val == undefined) {
    ret = true
  }
  if (val == null) {
    ret = true
  }
  if (Number.isNaN(val)) {
    ret = true
  }
  if (isNumber(val) && !Number.isFinite(val)) {
    ret = true
  }
  if (isObject(val)) {
    let f = true
    for (let i in val) {
      f = false
      break
    }
    ret = f
  }
  if (isArray(val) && val.length == 0) {
    ret = true
  }
  return ret
}

export function isNotEmpty(val) {
  return !isEmpty(val)
}