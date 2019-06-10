import {login, logout, getInfo} from '@/api/login'
import {getToken, setToken, removeToken, getLoginId, setLoginId, removeLoginId} from '@/utils/auth'
import {Message} from 'element-ui'


const user = {
  state: {
    token: getToken(),
    login_id: getLoginId(),
    nick_name: '',
    image: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_LOGIN_ID: (state, login_id) => {
      state.login_id = login_id
    },
    SET_NICK_NAME: (state, nick_name) => {
      state.nick_name = nick_name
    },
    SET_IMAGE: (state, image) => {
      state.image = image
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({commit}, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          setToken(response.access_token)
          setLoginId(username)
          commit('SET_TOKEN', response.access_token)
          commit('SET_LOGIN_ID', userInfo.username)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({commit, state}) {
      // console.log(getLoginId())
      // console.log('http://gateway.zan-qian.com/' + 'profile-service/1.0.0/queryUserProfileById/' + getLoginId())
      return new Promise((resolve, reject) => {
        // this.$http.post('http://gateway.zan-qian.com/' + 'profile-service/1.0.0/queryUserProfileById/' + getLoginId(), {}).then(response => {
          getInfo(getLoginId()).then(response => {
          if (response.result) {
            commit('SET_NICK_NAME', response.jsonstr.nickName)
            commit('SET_IMAGE', response.jsonstr.image)
            resolve(response)
          } else {
            Message({
              message: '获取信息失败',
              type: 'error'
            })
          }
          /* const data = response.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_LOGIN_ID', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve(response)*/
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({commit, state}) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          // commit('SET_ROLES', [])
          removeToken()
          removeLoginId()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({commit}) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        removeLoginId()
        resolve()
      })
    }
  }
}

export default user
