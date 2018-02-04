<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h4 class="primary--text display-1">Create a new meetup</h4>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 class="mt-3">
        <form>
          <v-layout row>
            <v-flex x12 sm6 offset-sm3>
              <v-text-field
                name="title"
                label="Title"
                id="title"
                v-model="title"
                required>
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex x12 sm6 offset-sm3>
              <v-text-field
                name="location"
                label="Location"
                id="location"
                v-model="location"
                required>
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex x12 sm6 offset-sm3>
              <v-btn raised class="primary" @click="onPickFile">Upload Image</v-btn>
              <input
                type="file"
                style="display: none"
                ref="fileInput"
                accept="image/*"
                @change="onFilePicked"
              >
              <!-- <v-text-field
                name="imageUrl"
                label="Image Url"
                id="imageUrl"
                v-model="imageUrl"
                required>
              </v-text-field> -->
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex x12 sm6 offset-sm3>
              <img :src="imageUrl" height="200" />
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex x12 sm6 offset-sm3>
              <v-text-field
                name="description"
                label="Description"
                id="description"
                multi-line
                v-model="description"
                required>
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm3 offset-sm3>
              <v-date-picker v-model="date" @click="setDateTimePicker"></v-date-picker>
            </v-flex>
            <v-flex xs12 sm3 class="ml-1">
              <v-time-picker v-model="time" @click="setDateTimePicker"></v-time-picker>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3 class="mt-3">
              <v-btn class="primary" :disabled="!formIsValid" @click="createMeetup">Create Meetup</v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  export default {
    data () {
      return {
        title: '',
        location: '',
        description: '',
        imageUrl: '',
        date: null,
        time: new Date(),
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
      setDateTimePicker () {
        const date = new Date(this.date)

        if (typeof this.time === 'string') {
          const hours = this.time.match(/^(\d+)/)[1]
          const minutes = this.time.match(/:(\d+)/)[1]

          date.setHours(hours)
          date.setHours(minutes)
        } else {
          date.setHours(this.time.getHours())
          date.setHours(this.time.getMinutes())
        }
        return date
      }
    },
    methods: {
      createMeetup () {
        if (!this.formIsValid) {
          return
        }
        if (!this.image) {
          return
        }
        const meetup = {
          title: this.title,
          location: this.location,
          image: this.image,
          description: this.description,
          date: new Date()
        }
        this.$store.dispatch('createMeetup', meetup)

        return this.$router.push('/meetups')
      },
      onPickFile () {
        return this.$refs.fileInput.click()
      },
      onFilePicked (event) {
        const files = event.target.files
        let filename = files[0].name

        if (filename.lastIndexOf('.') <= 0) {
          return alert('Please upload a valid image!')
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
