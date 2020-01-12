<template>
  <q-dialog full-width ref="dialog" @hide="onDialogHide" persistent transition-show="flip-down" transition-hide="flip-up">
    <q-card class="q-dialog-plugin bg-primary text-info">
      <q-bar>
        <q-icon name="fas fa-donate" />
        <div>Donations</div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip content-class="bg-secondary text-info">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section>
        Donate
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onOKClick" />
        <q-btn color="primary" label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
  },
  data () {
    return {
    }
  },
  methods: {
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    onDialogHide () {
      this.$emit('hide')
    },
    onOKClick () {
      this.$emit('ok')
      this.hide()
    },
    onCancelClick () {
      this.hide()
    }
  }
}
</script>
