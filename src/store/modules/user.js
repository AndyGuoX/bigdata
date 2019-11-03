import {login, logout, getUserInfo} from '@/request/api/user'
import {getToken, setToken, removeToken} from '@/utils/auth'
import {resetRouter} from '@/router'

const state = {
  token: getToken(),
  name: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({commit}, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(res => {
        if (res.loginResult) {
          commit('SET_TOKEN', res.token)
          setToken(res.token)
        }
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getUserInfo({commit}) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(res => {
        const {name, roles} = res
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({commit}) {
    return new Promise((resolve, reject) => {
      logout().then((res) => {
        if (res.success) {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resetRouter()
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

