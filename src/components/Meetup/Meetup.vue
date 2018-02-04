<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm10 md10 offset-sm1 offset-md1>
        <v-card v-if="meetup">
          <v-card-title>
            <h6 class="primary--text mb-0 title">{{ meetup.title }}</h6>
          </v-card-title>
          <v-card-media
              class="white--text"
              height="400px"
              src="http://www.telegraph.co.uk/content/dam/Travel/Destinations/Asia/Japan/Tokyo/Tokyo%20lead-xlarge.jpg"
          >
          </v-card-media>
          <v-card-text>
            <div class="info--text">{{ meetup.date | date }} - Where is takes place</div>
            <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error exercitationem illum iste quas.
              Aliquam amet architecto deserunt doloremque eaque, fuga inventore iure, labore mollitia sed
              similique totam, veritatis vero voluptatum!
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="primary">Register</v-btn>
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
      }
    }
  }
</script>
