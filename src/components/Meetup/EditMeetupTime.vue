<template>
  <v-dialog width="350px" persistent v-model="editDialog">
    <v-btn floating accent slot="activator">
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
            <v-time-picker v-model="editTime" style="width: 100%" actions>
                <v-btn
                  class="blue--text darken-1"
                  flat
                  @click.native="editDialog = false"
                >
                  Close
                </v-btn>
                <v-btn
                  class="blue--text darken-1"
                  flat
                  @click.native="onSave"
                >
                  Save
                </v-btn>
            </v-time-picker>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-actions>
              <v-btn flat class="blue--text darken-1" @click="editDialog = false">Close</v-btn>
              <v-btn flat class="blue--text darken-1" @click="onSave">Save</v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['meetup'],
  data () {
    return {
      editDialog: false,
      editTime: null
    }
  },
  methods: {
    onSave () {
      const newDate = new Date(this.meetup.date)

      let hours = this.editTime.match(/^(\d+)/)[1]
      const minutes = this.editTime.match(/:(\d+)/)[1]

      newDate.setHours(hours)
      newDate.setMinutes(minutes)

      this.$store.dispatch('updateMeetupData', {
        id: this.meetup.id,
        date: newDate
      })
    }
  },
  created () {
    this.editTime = new Date(this.meetup.date).toTimeString()
  }
}
</script>

