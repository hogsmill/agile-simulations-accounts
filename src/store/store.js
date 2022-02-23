import { createStore } from 'vuex'

export const store = createStore({
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
