import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedMeetups: [
      {
        id: '112kjklajskdlajsd',
        imageUrl: 'http://www.telegraph.co.uk/content/dam/Travel/Destinations/Asia/Japan/Tokyo/Tokyo%20lead-xlarge.jpg',
        title: 'Tokyo meetup',
        date: '2018-02-03'
      },
      {
        id: 'a24kjklajskdalgsd',
        imageUrl: 'http://static.thanhniennews.com/uploaded/minhhung/2014_06_21/caurong1_vgar.jpg?width=840',
        title: 'Meetup in Vietnam',
        date: '2018-02-01'
      }
    ],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    CREATE_MEETUP: (state, payload) => {
      return state.loadedMeetups.push(payload)
    },
    SET_USER: (state, payload) => {
      state.user = payload
    },
    SET_LOADING: (state, payload) => {
      state.loading = payload
    }
  },
  actions: {
    createMeetup ({commit}, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date,
        id: 'asdasds1231'
      }
      // TODO: register to firebase

      return commit('CREATE_MEETUP', meetup)
    },
    signUserUp ({commit}, payload) {
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            const newUser = {
              id: user.uid,
              registeredMeetups: []
            }
            commit('SET_USER', newUser)
          }
        )
        .catch(
          error => {
            console.log(error)
          }
        )
    },
    signUserIn ({commit}, payload) {
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            const signedInUser = {
              id: user.uid,
              registeredMeetups: []
            }
            commit('SET_USER', signedInUser)
          }
        )
        .catch(
          error => {
            console.log(error)
          }
        )
    }
  },
  getters: {
    loadedMeetups (state) {
      return state.loadedMeetups.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date
      })
    },
    featuredMeetups (state, getters) {
      return getters.loadedMeetups.slice(0, 5)
    },
    loadedMeetup (state) {
      return (meetupId) => {
        return state.loadedMeetups.find((meetup) => {
          return meetup.id === meetupId
        })
      }
    },
    getUser (state) {
      return state.user
    }
  }
})
