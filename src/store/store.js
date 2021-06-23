import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    thisGame: 'Socket Test',
    accounts: []
  },
  getters: {
    thisGame: (state) => {
      return state.thisGame
    },
    getAccounts: (state) => {
      return state.accounts
    }
  },
  mutations: {
    updateAccounts: (state, payload) => {
      state.accounts = payload
    }
  },
  actions: {
    updateAccounts: ({ commit }, payload) => {
      commit('updateAccounts', payload)
    }
  }
})
