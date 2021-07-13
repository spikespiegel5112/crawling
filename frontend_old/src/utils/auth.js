import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const loginIdKey = 'Admin-Login-Id'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getLoginId() {
  return Cookies.get(loginIdKey)
}

export function setLoginId(loginId) {
  return Cookies.set(loginIdKey, loginId)
}

export function removeLoginId() {
  return Cookies.remove(loginIdKey)
}
