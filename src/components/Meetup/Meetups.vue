<template>
  <v-container>
    <v-layout
      row
      wrap
      v-for="meetup in meetups"
      :key="meetup.id"
      class="mb-2"
    >
      <v-flex xs12 sm10 md10 offset-sm1 offset-md1>
        <v-card class="info">
          <v-container fluid>
            <v-layout row>
              <v-flex xs5 sm4 md3>
                <v-card-media
                    class="white--text"
                    height="200px"
                    :src="meetup.imageUrl"
                >
                </v-card-media>
              </v-flex>
              <v-flex xs7 sm8 md9>
                <v-card-title primary-title>
                  <div>
                    <h5 class="headline mb-0 white--text">{{ meetup.title }}</h5>
                    <div>{{ meetup.date | date }}</div>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-btn :to="/meetup/ + meetup.id">
                    <v-icon left>arrow_forward</v-icon>
                    View Meetup
                  </v-btn>
                </v-card-actions>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  export default {
    computed: {
      meetups () {
        return this.$store.getters.loadedMeetups
      }
    }
  }
</script>
