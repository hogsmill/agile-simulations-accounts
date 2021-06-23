<template>
  <div>
    <div v-if="!allowed">
      <h1>
        You do not have permission to access this app
      </h1>
    </div>
    <div v-if="allowed" id="app">
      <h1>
        Agile Simulations Accounts
      </h1>
      <table border>
        <tr>
          <td>
            <input type="checkbox" id="new-enabled" checked="true">
          </td>
          <td>
            <input type="text" id="new-username">
          </td>
          <td colspan="3" class="add-new">
            <button @click="addAccount()">
              Add New
            </button>
          </td>
        </tr>
        <tr class="header">
          <td>
            Enabled
          </td>
          <td>
            Username/Company
          </td>
          <td>
            Passcode
          </td>
          <td>
            Logins
          </td>
          <td>
            Actions
          </td>
        </tr>
        <tr v-for="(account, index) in accounts" :key="index">
          <td>
            <input type="checkbox" :checked="account.enabled" @click="toggleEnableAccount(account)">
          </td>
          <td>
            {{ account.userName }}
          </td>
          <td>
            <span>{{ account.passCode }}</span>
          </td>
          <td>
            {{ account.logins .length }}
          <td>
            <button @click="deleteAccount(account)">
              Delete
            </button>
            <button @click="changePassCode(account)">
              New Passcode
            </button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import bus from './socket.js'

export default {
  name: 'App',
  data() {
    return {
      id: '1234567',
      allowed: false
    }
  },
  computed: {
    accounts() {
      return this.$store.getters.getAccounts
    }
  },
  created() {
    const id = localStorage.getItem('agile-simulations-accounts')
    if (id == this.id) {
      this.allowed = true
      bus.$emit('sendLoadAccounts', {id: this.id})
    }

    bus.$on('loadAccounts', (data) => {
      if (data.id == this.id) {
        this.$store.dispatch('updateAccounts', data.accounts)
      }
    })

    bus.$on('accountExists', (data) => {
      console.log(data)
      if (data.id == this.id) {
        alert('Accont exists for ' + data.userName)
      }
    })
  },
  methods: {
    addAccount() {
      const enabled = document.getElementById('new-enabled').value
      const userName = document.getElementById('new-username').value
      bus.$emit('sendCreateAccount', {id: this.id, userName: userName, enabled: enabled})
    },
    toggleEnableAccount(account) {
      bus.$emit('sendToggleEnableAccount', {id: this.id, userName: account.userName, enabled: !account.enabled})
    },
    changePassCode(account) {
      bus.$emit('sendNewPassCode', {id: this.id, userName: account.userName})
    },
    deleteAccount(account) {
      bus.$emit('sendDeleteAccount', {id: this.id, userName: account.userName})
    }
  }
}
</script>

<style lang="scss">
  table {
  margin: 0 auto;

    tr {
      &.header {
        font-weight: bold;
      }

      td {
        padding: 6px;

        &.add-new {
          text-align: left;
        }

        button {
          margin: 0 6px;
        }
      }
    }
  }
</style>
