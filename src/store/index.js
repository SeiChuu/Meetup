import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedMeetups: [],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    LOAD_MEETUPS: (state, payload) => {
      state.loadedMeetups = payload
    },
    CREATE_MEETUP: (state, payload) => {
      return state.loadedMeetups.push(payload)
    },
    UPDATE_MEETUP: (state, payload) => {
      const meetup = state.loadedMeetups.find(meetup => {
        return meetup.id === payload.id
      })
      if (payload.title) {
        meetup.title = payload.title
      }
      if (payload.description) {
        meetup.description = payload.description
      }
      if (payload.date) {
        meetup.date = payload.date
      }
    },
    SET_USER: (state, payload) => {
      state.user = payload
    },
    SET_LOADING: (state, payload) => {
      state.loading = payload
    },
    SET_ERROR: (state, payload) => {
      state.error = payload
    },
    CLEAR_ERROR: (state) => {
      state.error = null
    },
    REGISTER_MEETUP: (state, payload) => {
      const id = payload.id
      if (state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0) {
        return
      }
      state.user.registeredMeetups.push(id)
      state.user.fbKeys[id] = payload.fbKey
    },
    UNREGISTER_MEETUP: (state, payload) => {
      const registeredMeetups = state.user.registeredMeetups
      registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
      Reflect.deleteProperty(state.user.fbKeys, payload)
    }
  },
  actions: {
    registerUserForMeetup ({commit, getters}, payload) {
      commit('SET_LOADING', true)
      const user = getters.getUser
      firebase.database().ref('/users/' + user.id).child('/registration')
        .push(payload)
        .then(data => {
          commit('SET_LOADING', false)
          commit('REGISTER_MEETUP', {id: payload, fbKey: data.key})
        })
        .catch(error => {
          console.log(error)
          commit('SET_LOADING', false)
        })
    },
    unRegisterUserForMeetup ({commit, getters}, payload) {
      commit('SET_LOADING', true)
      const user = getters.getUser
      if (!user.fbKeys) {
        return
      }
      const fbKey = user.fbKeys[payload]
      firebase.database().ref('/users/' + user.id + '/registration').child(fbKey)
        .remove()
        .then(() => {
          commit('SET_LOADING', false)
          commit('UNREGISTER_MEETUP', payload)
        })
        .catch(error => {
          console.log(error)
          commit('SET_LOADING', false)
        })
    },
    loadMeetups ({commit}) {
      commit('SET_LOADING', true)
      firebase.database().ref('meetups').once('value')
        .then(data => {
          const meetups = []
          const obj = data.val()
          for (let key in obj) {
            meetups.push({
              id: key,
              title: obj[key].title,
              description: obj[key].description,
              location: obj[key].location,
              imageUrl: obj[key].imageUrl,
              date: obj[key].date,
              creatorId: obj[key].creatorId
            })
          }
          commit('LOAD_MEETUPS', meetups)
          commit('SET_LOADING', false)
        })
        .catch(error => {
          commit('SET_LOADING', false)
          console.log(error)
        })
    },
    createMeetup ({commit, getters}, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        description: payload.description,
        date: payload.date.toISOString(),
        creatorId: getters.getUser.id
      }

      let key, imageUrl
      firebase.database().ref('meetups').push(meetup)
        .then(data => {
          key = data.key
          return key
        })
        .then(key => {
          const filename = payload.image.name
          const ext = filename.slice(filename.lastIndexOf('.'))
          return firebase.storage().ref('meetups/' + key + '.' + ext).put(payload.image)
        })
        .then(fileData => {
          imageUrl = fileData.metadata.downloadURLs[0]
          return firebase.database().ref('meetups').child(key).update({
            imageUrl: imageUrl
          })
        })
        .then(() => {
          commit('CREATE_MEETUP', {
            ...meetup,
            imageUrl: imageUrl,
            id: key
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    updateMeetupData ({commit}, payload) {
      commit('SET_LOADING', true)
      const updateObj = {}
      if (payload.title) {
        updateObj.title = payload.title
      }
      if (payload.description) {
        updateObj.description = payload.description
      }
      if (payload.date) {
        updateObj.date = payload.date
      }
      firebase.database().ref('meetups').child(payload.id).update(updateObj)
        .then(() => {
          commit('SET_LOADING', false)
          commit('UPDATE_MEETUP', payload)
        })
        .catch(error => {
          commit('SET_LOADING', false)
          console.log(error)
        })
    },
    signUserUp ({commit}, payload) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('SET_LOADING', false)
            const newUser = {
              id: user.uid,
              registeredMeetups: [],
              fbKeys: {}
            }
            commit('SET_USER', newUser)
          }
        )
        .catch(
          error => {
            commit('SET_LOADING', false)
            commit('SET_ERROR', error)
          }
        )
    },
    signUserIn ({commit}, payload) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('SET_LOADING', false)
            const signedInUser = {
              id: user.uid,
              registeredMeetups: [],
              fbKeys: {}
            }
            commit('SET_USER', signedInUser)
          }
        )
        .catch(
          error => {
            commit('SET_LOADING', false)
            commit('SET_ERROR', error)
          }
        )
    },
    autoSignin ({commit}, payload) {
      const signedInUser = {
        id: payload.uid,
        registeredMeetups: [],
        fbKeys: {}
      }
      commit('SET_USER', signedInUser)
    },
    fetchUserData ({commit, getters}) {
      commit('SET_LOADING', true)
      firebase.database().ref('/users/' + getters.getUser.id + '/registration/').once('value')
        .then(data => {
          const dataPairs = data.val()
          let registeredMeetups = []
          let swappedPairs = {}
          for (let key in dataPairs) {
            registeredMeetups.push(dataPairs[key])
            swappedPairs[dataPairs[key]] = key
          }
          const updateUser = {
            id: getters.getUser.id,
            registeredMeetups: registeredMeetups,
            fbKeys: swappedPairs
          }
          commit('SET_USER', updateUser)
          commit('SET_LOADING', false)
        })
        .catch(error => {
          console.log(error)
          commit('SET_LOADING', false)
        })
    },
    logOut ({commit}) {
      firebase.auth().signOut()
      commit('SET_USER', null)
    },
    clearError ({commit}) {
      commit('CLEAR_ERROR')
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
    },
    error (state) {
      return state.error
    },
    loading (state) {
      return state.loading
    }
  }
})
