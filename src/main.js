// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import * as firebase from 'firebase'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import {store} from './store/index'
import DateFilter from './filters/date'
import AlertComponent from './components/Shared/Alert.vue'
import EditMeetupDetailsComponent from './components/Meetup/EditMeetupDetails.vue'
import EditMeetupDateComponent from './components/Meetup/EditMeetupDate.vue'
import EditMeetupTimeComponent from './components/Meetup/EditMeetupTime.vue'
import RegisterMeetupComponent from './components/Meetup/RegisterMeetup.vue'

Vue.use(Vuetify, {
  theme: {
    primary: '#1976D2',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  }
})

Vue.config.productionTip = false

Vue.filter('date', DateFilter)
Vue.component('app-alert', AlertComponent)
Vue.component('edit-meetup-detail', EditMeetupDetailsComponent)
Vue.component('edit-meetup-date', EditMeetupDateComponent)
Vue.component('edit-meetup-time', EditMeetupTimeComponent)
Vue.component('register-meetup', RegisterMeetupComponent)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyAsUSjDT9AyWRoRXYdfoR7U4vxNA-WM5UA',
      authDomain: 'mymeetup-e2f5f.firebaseapp.com',
      databaseURL: 'https://mymeetup-e2f5f.firebaseio.com',
      projectId: 'mymeetup-e2f5f',
      storageBucket: 'gs://mymeetup-e2f5f.appspot.com/',
      messagingSenderId: '625450768470'
    })

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('autoSignin', user)
        this.$store.dispatch('fetchUserData')
      }
    })

    this.$store.dispatch('loadMeetups')
  }
})
