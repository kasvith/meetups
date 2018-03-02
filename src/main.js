// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import * as firebase from 'firebase'
import router from './router'
import Vuetify from 'vuetify'
import { store } from './store'
import DateFilter from './filters/date'
import Alert from './components/Shared/Alert'
import EditMeetupDetailsDialog from './components/Meetup/Edit/EditMeetupDetailsDialog'
import EditMeetupDateDialog from './components/Meetup/Edit/EditMeetupDateDialog'
import EditMeetupTimeDialog from './components/Meetup/Edit/EditMeetupTimeDialog'
import RegisterDialog from './components/Meetup/Registration/RegisterDialog'
import 'vuetify/dist/vuetify.min.css'
import './styles/loaders.css'

Vue.use(Vuetify, {
  theme: {
    primary: '#F57C00',
    secondary: '#FFC107',
    accent: '#E65100',
    error: '#f44336',
    warning: '#FFEB3B',
    info: '#4FC3F7',
    success: '#4caf50'
  }})

Vue.filter('date', DateFilter)
Vue.component('app-alert', Alert)
Vue.component('app-edit-meetup-details-dialog', EditMeetupDetailsDialog)
Vue.component('app-edit-meetup-date-dialog', EditMeetupDateDialog)
Vue.component('app-edit-meetup-time-dialog', EditMeetupTimeDialog)
Vue.component('app-meetup-register-dialog', RegisterDialog)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    var config = {
      apiKey: 'AIzaSyCSW2Nct3VhBG2-Fc5PEDJ6MYL-hYzDexI',
      authDomain: 'meetups-294fc.firebaseapp.com',
      databaseURL: 'https://meetups-294fc.firebaseio.com',
      projectId: 'meetups-294fc',
      storageBucket: 'meetups-294fc.appspot.com',
      messagingSenderId: '946387877842'
    }
    firebase.initializeApp(config)

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
      }
    })

    this.$store.dispatch('loadMeetups')
  }
})
