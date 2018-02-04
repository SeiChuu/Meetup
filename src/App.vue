<template>
  <v-app>
    <v-toolbar dark class="primary">
      <v-toolbar-side-icon
        @click.stop="sideNav = ! sideNav"
        class="hidden-sm-and-up"
      >
      </v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">Meetup</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-xs-only">
        <v-btn
            v-for="menuItem in menuItems"
            flat
            :to="menuItem.link"
            :key="menuItem.title"
        >
          <v-icon left>{{ menuItem.icon }}</v-icon>
          {{ menuItem.title }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-navigation-drawer
      v-model="sideNav"
      temporary
      light
      absolute
    >
      <v-list dense>
        <v-list-tile
            v-for="menuItem in menuItems"
            :key="menuItem.title"
            :to="menuItem.link"
            @click=""
        >
          <v-list-tile-action>
            <v-icon>{{ menuItem.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ menuItem.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <main>
      <router-view></router-view>
    </main>
  </v-app>
</template>

<script>
export default {
  computed: {
    menuItems () {
      let menuItems = [
        {icon: 'face', title: 'Sign up', link: '/signup'},
        {icon: 'lock_open', title: 'Sign in', link: '/signin'}
      ]
      if (this.userIsAuthenticated) {
        menuItems = [
          {icon: 'supervisor_account', title: 'View Meetups', link: '/meetups'},
          {icon: 'room', title: 'Organize Meetup', link: '/meetup/new'},
          {icon: 'person', title: 'Profile', link: '/profile'}
        ]
      }

      return menuItems
    },
    userIsAuthenticated () {
      let userSignedIn = this.$store.getters.getUser
      return userSignedIn !== null && userSignedIn !== undefined
    }
  },
  data () {
    return {
      sideNav: false
    }
  }
}
</script>
