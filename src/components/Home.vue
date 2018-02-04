<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm6 class="text-xs-center text-sm-right">
        <v-btn large router to="/meetups" class="info">Explore Meetups</v-btn>
      </v-flex>
      <v-flex xs12 sm6 class="text-xs-center text-sm-left">
        <v-btn large router to="/meetup/new" class="info">Organize Meetup</v-btn>
      </v-flex>
    </v-layout>
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
    <v-layout row wrap class="mt-2" v-if="!loading && meetups.length > 0">
      <v-flex xs12>
        <v-carousel>
          <v-carousel-item
              v-for="item in meetups"
              v-bind:src="item.imageUrl"
              :key="item.id"
          >
            <div class="title">
              <router-link :to="'/meetup/' + item.id" tag="span" style="cursor: pointer">{{ item.title }}</router-link>
            </div>
        </v-carousel-item>
        </v-carousel>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  export default {
    computed: {
      meetups () {
        return this.$store.getters.featuredMeetups
      },
      loading () {
        return this.$store.getters.loading
      }
    }
  }
</script>
<style scoped>
  .title {
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: 50px;
    background-color: rgba(0,0,0,0.5);
    font-size: 2em;
    color: white;
    padding: 20px;
  }
</style>
