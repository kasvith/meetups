'use strict'

export default {
  registerUserForMeetup (state, payload) {
    const id = payload.id
    if (state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0) return
    state.user.registeredMeetups.push(id)
    state.user.fbKeys[id] = payload.fbKey
  },

  unregisterUserForMeetup (state, payload) {
    const registeredMeetups = state.user.registeredMeetups
    registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
    Reflect.deleteProperty(state.user.fbKeys, payload)
  },

  setLoadedMeetups (state, payload) {
    state.loadedMeetups = payload
  },

  createMeetup (state, payload) {
    state.loadedMeetups.push(payload)
  },

  setUser (state, payload) {
    state.user = payload
  },

  setLoading (state, payload) {
    state.loading = payload
  },

  setError (state, payload) {
    state.error = payload
  },

  clearError (state, payload) {
    state.error = null
  },

  updateMeetup (state, payload) {
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
  }
}
