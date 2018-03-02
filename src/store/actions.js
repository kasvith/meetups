'use strict'

import * as firebase from 'firebase'

export default {
  registerUserForMeetup ({commit, getters}, payload) {
    commit('setLoading', true)
    const user = getters.user
    firebase.database()
      .ref('/users/' + user.id)
      .child('/registrations/')
      .push(payload)
      .then((data) => {
        commit('setLoading', false)
        commit('registerUserForMeetup', {id: payload, fbKey: data.key})
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
  },

  unregisterUserFromMeetup ({commit, getters}, payload) {
    commit('setLoading', true)
    const user = getters.user
    if (!user.fbKeys) return

    const fbKey = user.fbKeys[payload]
    firebase.database().ref('/users/' + user.id + '/registrations/')
      .child(fbKey)
      .remove()
      .then(() => {
        commit('setLoading', false)
        commit('unregisterUserForMeetup', payload)
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
  },

  loadMeetups ({commit}) {
    commit('setLoading', true)
    firebase.database().ref('meetups').once('value')
      .then((data) => {
        const meetups = []
        const obj = data.val()
        for (let key in obj) {
          meetups.push({
            id: key,
            title: obj[key].title,
            description: obj[key].description,
            imageUrl: obj[key].imageUrl,
            date: obj[key].date,
            creatorId: obj[key].creatorId,
            location: obj[key].location
          })
        }

        commit('setLoadedMeetups', meetups)
        commit('setLoading', false)
      })
      .catch((error) => {
        console.log(error)
        commit('setLoading', false)
      })
  },

  createMeetup ({commit, getters}, payload) {
    const meetup = {
      title: payload.title,
      location: payload.location,
      description: payload.description,
      date: payload.date.toISOString(),
      creatorId: getters.user.id
    }
    // store in firebase
    let imageUrl = null
    let key = null
    firebase.database().ref('meetups').push(meetup)
      .then((data) => {
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
        commit('createMeetup', {
          ...meetup,
          imageUrl: imageUrl,
          id: key
        })
      })
      .catch((error) => {
        console.log(error)
      })
  },

  updateMeetupData ({commit}, payload) {
    commit('setLoading', true)
    const updatedObj = {}
    if (payload.title) {
      updatedObj.title = payload.title
    }

    if (payload.description) {
      updatedObj.description = payload.description
    }

    if (payload.date) {
      updatedObj.date = payload.date
    }

    firebase.database().ref('meetups').child(payload.id).update(updatedObj)
      .then(() => {
        commit('setLoading', false)
        commit('updateMeetup', payload)
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
  },

  signUserUp ({commit}, payload) {
    commit('setLoading', true)
    commit('clearError')
    firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then(user => {
        commit('setLoading', false)
        const newUser = {
          id: user.uid,
          registeredMeetups: [],
          fbKeys: {}
        }

        commit('setUser', newUser)
      })
      .catch(
        error => {
          commit('setLoading', false)
          commit('setError', error)
        }
      )
  },

  signUserIn ({commit}, payload) {
    commit('setLoading', true)
    commit('clearError')
    firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(user => {
        commit('setLoading', false)
        const newUser = {
          id: user.uid,
          registeredMeetups: [],
          fbKeys: {}
        }

        commit('setUser', newUser)
      })
      .catch(
        error => {
          commit('setLoading', false)
          commit('setError', error)
        }
      )
  },

  autoSignIn ({commit}, payload) {
    commit('setUser', {
      id: payload.uid,
      registeredMeetups: [],
      fbKeys: {}
    })
  },

  fetchUserData ({commit, getters}) {
    commit('setLoading', true)
    firebase.database().ref('/users/' + getters.user.id + '/registrations/')
      .once('value')
      .then(data => {
        const dataParis = data.val()
        let registeredMeetups = []
        let swappedParis = []
        for (let key in dataParis) {
          registeredMeetups.push(dataParis[key])
          swappedParis[dataParis[key]] = key
        }

        const updatedUser = {
          id: getters.user.id,
          registeredMeetups: registeredMeetups,
          fbKeys: swappedParis
        }

        commit('setLoading', false)
        commit('setUser', updatedUser)
      })
  },

  logout ({commit}) {
    firebase.auth().signOut()
    commit('setUser', null)
  },

  clearError ({commit}) {
    commit('clearError')
  }
}
