<template>
  <v-dialog width="350px" persistent v-model="editDialog">
    <v-btn accent slot="activator">
      Edit Time
    </v-btn>

    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>Edit Meetup Time</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-time-picker v-model="editableTime" style="width: 100%" actions>
              <template slot-scope="{save, cancel}">
                <v-spacer></v-spacer>
                <v-btn class="blue--text darken-1" flat @click.native="onSaveChanges">Save</v-btn>
                <v-btn class="blue--text darken-1" flat @click.native="editDialog = false">Close</v-btn>
              </template>
            </v-time-picker>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'edit-meetup-time-dialog',
    props: ['meetup'],
    data () {
      return {
        editDialog: false,
        editableTime: ''
      }
    },
    methods: {
      onSaveChanges () {
        const newDate = new Date(this.meetup.date)
        const hh = this.editableTime.split(':')[0]
        const mm = this.editableTime.split(':')[1]

        newDate.setHours(hh)
        newDate.setMinutes(mm)

        this.$store.dispatch('updateMeetupData', {
          id: this.meetup.id,
          date: newDate
        })
      }
    },
    created () {
      let date = new Date(this.meetup.date)
      this.editableTime = date.getHours() + ':' + date.getMinutes()
    }
  }
</script>

<style scoped>

</style>
