import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    thisGame: 'Agile Simulations Accounts',
    accounts: []
  },
  getters: {
    thisGame: (state) => {
      return state.thisGame
    },
    getLevels: (state) => {
      return [
        'Using',
        'Regular Use',
        'Dedicated',
        'Admin'
      ]
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
