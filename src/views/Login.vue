<template>
  <div class="h-100">
    <b-overlay :show="overlay" variant="secondary" no-wrap></b-overlay>

    <b-container fluid class="h-100">
      <b-row align-v="center" class="h-100">
        <b-col>
          <!--
          <qr></qr>
          -->

          <creds v-on:overlay-on="overlay = true" v-on:overlay-off="overlay = false"></creds>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import qr from '../components/Login-QR';
import creds from '../components/Login-Creds';

export default {
  components: {
    qr,
    creds
  },
  data() {
    return {
      overlay: false
    }
  },
  mounted() {
    this.$mtproto.call('help.getNearestDc').then(result => {
      this.$mtproto.setDefaultDc(result.nearest_dc);
    }).catch(error => {
      console.error(error);
    });
  }
}
</script>
