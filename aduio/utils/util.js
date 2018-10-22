let Promise = require('es6-promise.js');
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const wxPromise = (fn) => {
  return (obj = {}) => {
    return new Promise((resolve, reject) => {
        obj.success = (res) => {
          resolve(res)
        };
        obj.fail = (res) => {
          reject(res)
        };
        fn(obj)
    })
  }
}

module.exports = {
  formatTime: formatTime,
  wxPromise: wxPromise
}
