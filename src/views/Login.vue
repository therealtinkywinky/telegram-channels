<template>
  <div class="h-100">
    <b-overlay :show="overlay" variant="secondary" no-wrap></b-overlay>

    <b-container fluid class="h-100">
      <b-row align-v="center" class="h-100">
        <b-col>
          <b-card
            v-if="card_phone"
            text-variant="white"
            bg-variant="dark"
            style="width: 25%"
            class="mx-auto"
            footer-bg-variant="danger">

            <b-card-text>
              <b-form-input v-model.trim="phone" placeholder="Phone Number" @input="error = false"></b-form-input>
            </b-card-text>

            <b-button href="#" variant="success" @click="sendCode">Send Code</b-button>

            <template #footer v-if="error">An error occured!</template>
          </b-card>

          <b-card
            v-if="card_code"
            text-variant="white"
            bg-variant="dark"
            style="width: 25%"
            class="mx-auto"
            footer-bg-variant="danger">

            <b-card-text>
              <b-form-input v-model.trim="code" placeholder="Code" @input="error = false"></b-form-input>
            </b-card-text>

            <b-button href="#" variant="info" @click="signIn">Sign In</b-button>

            <template #footer v-if="error">An error occured!</template>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
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

      this.$mtproto.call('auth.sendCode', {
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

      this.$mtproto.call('auth.signIn', {
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

    this.$mtproto.call('help.getNearestDc').then(result => {
      this.$mtproto.setDefaultDc(result.nearest_dc);
    }).catch(error => {
      console.error(error);
    });

  }
}
</script>
