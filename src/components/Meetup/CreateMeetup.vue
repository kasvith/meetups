<template>
    <v-container>
      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <h2>
            Create a new meetup
          </h2>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <form @submit.prevent="onCreateMeetup">
             <v-layout row>
               <v-flex xs12 sm6 offset-sm3>
                 <v-text-field
                   name="title"
                   label="Title"
                   id="title"
                   v-model="title"
                   required></v-text-field>
               </v-flex>
             </v-layout>
            <v-layout row>
              <v-flex xs12 sm6 offset-sm3>
                <v-text-field
                  name="location"
                  label="Location"
                  id="location"
                  v-model="location"
                  required></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12 sm6 offset-sm3>
                <v-btn raised class="primary" @click="onPickFile">Upload Image</v-btn>
                <input type="file"
                       style="display: none"
                       ref="fileInput"
                       accept="image/*"
                       @change="onFilePicked"
                />
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12 sm6 offset-sm3>
                <img :src="imageUrl" height="200">
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12 sm6 offset-sm3>
                <v-text-field
                  multi-line
                  name="description"
                  label="Description"
                  id="description"
                  v-model="description"
                  required></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12 sm6 offset-sm3>
                <h2>Select Date : </h2>
                <v-date-picker v-model="date"></v-date-picker>
              </v-flex>
            </v-layout>
            <v-layout row class="mt-2">
              <v-flex xs12 sm6 offset-sm3>
                <h2>Select Time : </h2>
                <v-time-picker v-model="time"></v-time-picker>
              </v-flex>
            </v-layout>
            <v-layout row class="mt-2">
              <v-flex xs12 sm6 offset-sm3>
                <v-btn
                  class="primary"
                  :disabled="!formIsValid"
                  type="submit">
                  Create Meetup
                </v-btn>
              </v-flex>
            </v-layout>
          </form>
        </v-flex>
      </v-layout>
    </v-container>
</template>

<script>
  export default {
    name: 'create-meetup',
    data () {
      return {
        title: '',
        location: '',
        imageUrl: '',
        description: '',
        date: '',
        time: null,
        image: null
      }
    },

    computed: {
      formIsValid () {
        return this.title !== '' &&
          this.location !== '' &&
          this.imageUrl !== '' &&
          this.description !== ''
      },

      datetime () {
        const date = new Date(this.date)
        const hh = this.time.split(':')[0]
        const mm = this.time.split(':')[1]
        date.setHours(hh)
        date.setMinutes(mm)
        return date
      }
    },

    created () {
      const date = new Date()
      this.date = new Date().toISOString().slice(0, 10)
      this.time = date.getHours() + ':' + date.getMinutes()
    },

    methods: {
      onCreateMeetup () {
        if (!this.formIsValid) return

        if (!this.image) return

        const meetupData = {
          title: this.title,
          location: this.location,
          image: this.image,
          description: this.description,
          date: this.datetime
        }

        this.$store.dispatch('createMeetup', meetupData)
        this.$router.push('/meetups')
      },

      onPickFile () {
        this.$refs.fileInput.click()
      },

      onFilePicked (event) {
        const files = event.target.files
        let filename = files[0].name
        if (filename.lastIndexOf('.') <= 0) {
          return alert('Please add a valid file')
        }

        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          this.imageUrl = fileReader.result
        })
        fileReader.readAsDataURL(files[0])
        this.image = files[0]
      }
    }
  }
</script>

<style scoped>

</style>
