'use strict'

export default {
  loadedMeetups (state) {
    return state.loadedMeetups.sort((meetupA, meetupB) => {
      return meetupA.date > meetupB.date
    })
  },

  loadedMeetup (state) {
    return (meetupID) => {
      return state.loadedMeetups.find((meetup) => {
        return meetup.id === meetupID
      })
    }
  },

  featuredMeetups (state, getters) {
    return getters.loadedMeetups.slice(0, 5)
  },

  user (state) {
    return state.user
  },

  loading (state) {
    return state.loading
  },

  error (state) {
    return state.error
  }
}
