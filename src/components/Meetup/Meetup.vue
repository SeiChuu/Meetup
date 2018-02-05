<template>
  <v-container>
    <v-layout v-if="loading" class="mt-5">
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular
          indeterminate
          color="primary"
          :width="7"
          :size="70"
        ></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout v-else row wrap>
      <v-flex xs12 sm10 md10 offset-sm1 offset-md1>
        <v-card v-if="meetup">
          <v-card-title>
            <h6 class="primary--text mb-0 title">{{ meetup.title }}</h6>
            <template v-if="userIsCreator">
              <v-spacer></v-spacer>
              <edit-meetup-detail :meetup="meetup"></edit-meetup-detail>
            </template>
          </v-card-title>
          <v-card-media
              class="white--text"
              height="400px"
              :src="meetup.imageUrl"
          >
          </v-card-media>
          <v-card-text>
            <div class="info--text">{{ meetup.date | date }} - {{ meetup.location }}</div>
            <edit-meetup-date :meetup="meetup" v-if="userIsCreator"></edit-meetup-date>
            <edit-meetup-time :meetup="meetup" v-if="userIsCreator"></edit-meetup-time>
            <div>{{ meetup.description }}</div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- <v-btn class="primary">Register</v-btn> -->
            <register-meetup
              :meetupId="meetup.id"
              v-if="userIsAuthenticated && !userIsCreator"
            ></register-meetup>
          </v-card-actions>
        </v-card>
        <div v-else>Nothing to show</div>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  export default {
    props: ['id'],
    computed: {
      meetup () {
        const meetup = this.$store.getters.loadedMeetup(this.id)
        if (!meetup) {
          return this.$router.push('/meetups')
        }
        return meetup
      },
      userIsAuthenticated () {
        return this.$store.getters.getUser !== null && this.$store.getters.getUser !== undefined
      },
      userIsCreator () {
        if (!this.userIsAuthenticated) {
          return false
        }
        return this.$store.getters.getUser.id === this.meetup.creatorId
      },
      loading () {
        return this.$store.getters.loading
      }
    }
  }
</script>
