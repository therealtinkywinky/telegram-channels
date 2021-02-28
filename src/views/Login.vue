<template>
  <div>
    <b-overlay :show="overlay" variant="secondary" no-wrap></b-overlay>

    <b-card
      v-if="card_phone"
      text-variant="white"
      bg-variant="dark"
      style="width: 25%"
      class="mx-auto mt-5"
      footer-bg-variant="danger">

      <b-card-text>
        <b-form-input v-model="phone" placeholder="Phone Number" @input="error = false"></b-form-input>
      </b-card-text>

      <b-button href="#" variant="success" @click="sendCode">Send Code</b-button>

      <template #footer v-if="error">An error occured!</template>
    </b-card>

    <b-card
      v-if="card_code"
      text-variant="white"
      bg-variant="dark"
      style="width: 25%"
      class="mx-auto mt-5"
      footer-bg-variant="danger">

      <b-card-text>
        <b-form-input v-model="code" placeholder="Code" @input="error = false"></b-form-input>
      </b-card-text>

      <b-button href="#" variant="info" @click="signIn">Sign In</b-button>

      <template #footer v-if="error">An error occured!</template>
    </b-card>
  </div>
</template>

<script>
const { MTProto } = require('@mtproto/core');

const api_id = process.env.VUE_APP_API_ID;
const api_hash = process.env.VUE_APP_API_HASH;

var mtproto;

export default {
  data() {
    return {
      overlay: false,
      error: false,

      phone: '',
      code: '',
      phone_code_hash: '',

      card_phone: true,
      card_code: false
    }
  },
  methods: {
    sendCode() {

      this.overlay = true;

      mtproto.call('auth.sendCode', {
        phone_number: this.phone,
        settings: {
          _: 'codeSettings',
        },
      }).then(response => {

        this.phone_code_hash = response.phone_code_hash;

        this.card_phone = false;
        this.card_code = true;

      }).catch(error => {

        this.error = true;

      }).finally(() => {

        this.overlay = false;

      });

    },
    signIn() {

      this.overlay = true;

      mtproto.call('auth.signIn', {
        phone_code: this.code,
        phone_number: this.phone,
        phone_code_hash: this.phone_code_hash,
      }).then(response => {

        this.$router.push('channels');

      }).catch(error => {

        this.error = true;

      }).finally(() => {

        this.overlay = false;

      });

    }
  },
  mounted() {

    mtproto = new MTProto({
      api_id,
      api_hash,
    });

    mtproto.call('help.getNearestDc').then(result => {
      mtproto.setDefaultDc(result.nearest_dc);
    }).catch(error => {
      console.error(error);
    });

  }
}
</script>
