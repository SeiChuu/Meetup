<template>
  <v-dialog width="350px" persistent v-model="editDialog">
    <v-btn floating accent slot="activator">
      Edit Date
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>Edit Meetup Date</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-date-picker v-model="editDate" style="width: 100%" actions>
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
            </v-date-picker>
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
      editDate: null
    }
  },
  methods: {
    onSave () {
      const newDate = new Date(this.meetup.date)

      const newDay = new Date(this.editDate).getUTCDate()
      const newMonth = new Date(this.editDate).getUTCMonth()
      const newYear = new Date(this.editDate).getUTCFullYear()
      newDate.setUTCDate(newDay)
      newDate.setUTCMonth(newMonth)
      newDate.setUTCFullYear(newYear)

      this.$store.dispatch('updateMeetupData', {
        id: this.meetup.id,
        date: newDate
      })
    }
  },
  created () {
    let date = new Date(this.meetup.date)

    let day = date.getUTCDate()
    let month = date.getUTCMonth() + 1
    let year = date.getUTCFullYear()

    this.editDate = year + '-' + month + '-' + day
  }
}
</script>

