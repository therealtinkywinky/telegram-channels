<template>
  <div class="h-100">
    <b-overlay :show="overlay" variant="secondary" no-wrap></b-overlay>

    <b-container fluid class="h-100">
      <b-row align-v="center" class="h-100">
        <b-col>
          <qr></qr>

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
            no-body
            text-variant="white"
            bg-variant="dark"
            style="width: 25%"
            class="mx-auto"
            footer-bg-variant="danger">

            <b-card-body>
              <b-card-text>
                <b-form-input v-model.trim="code" placeholder="Code" @input="error = ok = false"></b-form-input>
              </b-card-text>

              <b-button-group>
                <b-button href="#" variant="info" @click="signIn">Sign In</b-button>
                <b-button href="#" variant="danger" @click="resendCode">Resend Code</b-button>
              </b-button-group>
            </b-card-body>

            <b-card-footer v-if="error" footer-bg-variant="danger">An error occured!</b-card-footer>
            <b-card-footer v-if="ok" footer-bg-variant="success">Code sent successfully!</b-card-footer>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import qr from '../components/Login-QR';

export default {
  components: {
    qr
  },
  data() {
    return {
      overlay: false,
      error: false,
      ok: false,

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
    resendCode() {

      this.overlay = true;

      this.$mtproto.call('auth.resendCode', {
        phone_number: this.phone,
        phone_code_hash: this.phone_code_hash
      }).then((response) => {

        this.phone_code_hash = response.phone_code_hash;

        this.ok = true;

      }).catch((error) => {

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
