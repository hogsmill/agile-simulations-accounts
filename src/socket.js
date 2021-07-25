import io from 'socket.io-client'
import bus from './EventBus'

let connStr
if (location.hostname == 'localhost') {
  connStr = 'http://localhost:3099'
} else {
  connStr = 'https://agilesimulations.co.uk:3099'
}
console.log('Connecting to: ' + connStr)
const socket = io(connStr)

// Send

bus.$on('sendCheckAdminAccounts', (data) => { socket.emit('sendCheckAdminAccounts', data) })

bus.$on('sendLoadAccounts', (data) => { socket.emit('sendLoadAccounts', data) })

bus.$on('sendCreateAccount', (data) => { socket.emit('sendCreateAccount', data) })

bus.$on('sendToggleEnableAccount', (data) => { socket.emit('sendToggleEnableAccount', data) })

bus.$on('sendUpdateRoute', (data) => { socket.emit('sendUpdateRoute', data) })

bus.$on('sendUpdateLevel', (data) => { socket.emit('sendUpdateLevel', data) })

bus.$on('sendUpdateRenewal', (data) => { socket.emit('sendUpdateRenewal', data) })

bus.$on('sendNewPassCode', (data) => { socket.emit('sendNewPassCode', data) })

bus.$on('sendDeleteAccount', (data) => { socket.emit('sendDeleteAccount', data) })

// Receive

socket.on('loadAccounts', (data) => { bus.$emit('loadAccounts', data) })

socket.on('accountExists', (data) => { bus.$emit('accountExists', data) })

export default bus
