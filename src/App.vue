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
        <tr class="header">
          <td>
            Enabled
          </td>
          <td>
            Username/Company
          </td>
          <td>
            No of Users
          </td>
          <td>
            Route
          </td>
          <td>
            Level
          </td>
          <td>
            Renewal
          </td>
        </tr>
        <tr>
          <td>
            <input type="checkbox" id="new-enabled" checked="true">
          </td>
          <td>
            <input type="text" id="new-username">
          </td>
          <td>
            <input type="text" id="new-number-of-users" value="10">
          </td>
          <td>
            <input type="text" id="new-route">
          </td>
          <td>
            <select id="new-level">
              <option v-for="(level, lindex) in levels" :key="lindex">
                {{ level }}
              </option>
            </select>
          </td>
          <td>
            <select id="new-renewal-month">
              <option value="">
                (None)
              </option>
              <option v-for="(n, mindex) in 12" :key="mindex">
                {{ n }}
              </option>
            </select>
            <select id="new-renewal-year">
              <option value="">
                (None)
              </option>
              <option v-for="(n, yindex) in 10" :key="yindex">
                {{ n + 2020 }}
              </option>
            </select>
          </td>
          <td colspan="3" class="add-new">
            <button @click="addAccount()">
              Add New
            </button>
          </td>
        </tr>
      </table>
      <table border>
        <tr class="header">
          <td>
            Enabled
          </td>
          <td>
            Username/Company
          </td>
          <td>
            Users
          </td>
          <td>
            Route
          </td>
          <td>
            Passcode
          </td>
          <td>
            Admin
          </td>
          <td>
            Level
          </td>
          <td>
            Renewal
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
            {{ account.noOfUsers }}
          </td>
          <td v-if="editingRoute.userName != account.userName">
            <div class="route">
              {{ account.route }}
            </div>
            <button @click="editRoute(account)">
              Edit
            </button>
          </td>
          <td v-if="editingRoute.userName == account.userName">
            <input type="text" class="edit-route" :id="'route-' + account.userName" :value="account.route">
            <button @click="updateRoute(account)">
              Save
            </button>
          </td>
          <td>
            <span>{{ account.passCode }}</span>
          </td>
          <td>
            <span>{{ account.adminPassCode }}</span>
          </td>
          <td>
            <select :id="'level-' + account.userName" :value="account.level" @change="updateLevel(account)">
              <option value="">
                -- Select --
              </option>
              <option @change="updateLevel('Single Game')">
                Single Game
              </option>
              <option v-for="(level, lindex) in levels" :key="lindex" @change="updateLevel(account)">
                {{ level }}
              </option>
            </select>
            <div v-if="account.level == 'Single Game'">
              <div v-for="(game, gindex) in Object.keys(games)" :key="gindex" class="single-game">
                {{ account.games }}
                <input type="checkbox" :id="singleGameId(account, game)" :checked="account.games && account.games[game]" @click="updateLevel(account)"> {{ game }}
              </div>
            </div>
          </td>
          <td>
            <select :id="'renewal-month-' + account.userName" :value="account.renewal && account.renewal.month" @change="updateRenewal(account)">
              <option value="">
                (None)
              </option>
              <option v-for="(n, mindex) in 12" :key="mindex">
                {{ n }}
              </option>
            </select>
            <select :id="'renewal-year-' + account.userName" :value="account.renewal && account.renewal.year" @change="updateRenewal(account)">
              <option value="">
                (None)
              </option>
              <option v-for="(n, yindex) in 10" :key="yindex">
                {{ n + 2020 }}
              </option>
            </select>
          </td>
          <td>
            {{ account.logins.length }}
          </td>
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
      allowed: false,
      editingRoute: {},
      games: {
        'No Estimates': false,
        'Coin Game': false
      }
    }
  },
  computed: {
    accounts() {
      return this.$store.getters.getAccounts
    },
    levels() {
      return this.$store.getters.getLevels
    }
  },
  created() {
    bus.$emit('sendCheckAdminAccounts', {id: this.id})

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
      if (data.id == this.id) {
        alert('Accont exists for ' + data.userName)
      }
    })
  },
  methods: {
    addAccount() {
      const enabled = document.getElementById('new-enabled').value
      const userName = document.getElementById('new-username').value
      const noOfUsers = document.getElementById('new-number-of-users').value
      const route = document.getElementById('new-route').value
      const level = document.getElementById('new-level').value
      const month = document.getElementById('new-renewal-month').value
      const year = document.getElementById('new-renewal-year').value
      const renewal = {
        month: month,
        year: year
      }
      bus.$emit('sendCreateAccount', {id: this.id, userName: userName, noOfUsers: noOfUsers, route: route, level: level, renewal: renewal, enabled: enabled})
    },
    toggleEnableAccount(account) {
      bus.$emit('sendToggleEnableAccount', {id: this.id, userName: account.userName, enabled: !account.enabled})
    },
    editRoute(account) {
      this.editingRoute = account
    },
    updateRoute(account) {
      const route = document.getElementById('route-' + account.userName).value
      bus.$emit('sendUpdateRoute', {id: this.id, userName: account.userName, route: route})
      this.editingRoute = {}
    },
    singleGameId(account, game) {
      return 'single-game-' + account.userName.replace(/\s/g, '-') + '-' + game.replace(/\s/g, '-')
    },
    updateLevel(account) {
      const level = document.getElementById('level-' + account.userName).value
      const singleGames = this.games
      if (level == 'Single Game') {
        const games = Object.keys(this.games)
        for (let i = 0; i < games.length; i++) {
          singleGames[games[i]] = document.getElementById(this.singleGameId(account, games[i])).checked
        }
      }
      bus.$emit('sendUpdateLevel', {id: this.id, userName: account.userName, level: level, games: singleGames})
    },
    updateRenewal(account) {
      const month = document.getElementById('renewal-month-' + account.userName).value
      const year = document.getElementById('renewal-year-' + account.userName).value
      if (month && year) {
        const renewal = {
          month: month,
          year: year
        }
        bus.$emit('sendUpdateRenewal', {id: this.id, userName: account.userName, renewal: renewal})
      }
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
  margin: 12px auto;

    tr {
      &.header {
        font-weight: bold;
      }

      td {
        padding: 6px;

        #new-username, #new-route {
          width: 160px;
        }
        #new-number-of-users {
          width: 40px;
        }

        &.add-new {
          text-align: left;
        }

        button {
          margin: 0 6px;
        }

        .route {
          width: 106px;
          display: inline-block;
        }

        .edit-route {
          width: 100px;
        }

        .single-game {
          text-align: left;
        }
      }
    }
  }
</style>
