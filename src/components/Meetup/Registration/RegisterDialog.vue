<template>
  <v-dialog width="300px" persistent v-model="registerDialog">
    <v-btn class="primary" accent slot="activator">
      {{ userIsRegistered  ? 'Unregister' : 'Register' }}
    </v-btn>

    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>{{ userIsRegistered  ? 'Unregister from meetup' : 'Register for meetup' }}</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text>
              You can always change your decision later
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="green--text darken-1" flat @click="onAgree">Confirm</v-btn>
              <v-btn class="red--text darken-1" flat @click="registerDialog = false">Cancel</v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'register-dialog',
    data () {
      return {
        registerDialog: false
      }
    },
    props: ['meetupId'],
    computed: {
      userIsRegistered () {
        return this.$store.getters.user.registeredMeetups.findIndex(meetupId => {
          return meetupId === this.meetupId
        }) >= 0
      }
    },
    methods: {
      onAgree () {
        if (this.userIsRegistered) {
          this.$store.dispatch('unregisterUserFromMeetup', this.meetupId)
        } else {
          this.$store.dispatch('registerUserForMeetup', this.meetupId)
        }
      }
    }
  }
</script>

<style scoped>

</style>
