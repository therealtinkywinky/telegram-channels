<template>
  <div>
    <b-card text-variant="white" bg-variant="dark" style="width: 50%" class="mx-auto mt-5">
      <b-card-text>
        <b-form-input v-model="phone" placeholder="Phone Number"></b-form-input>
      </b-card-text>

      <b-button href="#" variant="primary">Send Code</b-button>
    </b-card>

    <b-card text-variant="white" bg-variant="dark" style="width: 50%" class="mx-auto mt-5">
      <b-card-text>
        <b-form-input v-model="code" placeholder="Code"></b-form-input>
      </b-card-text>

      <b-button href="#" variant="primary">Login</b-button>
    </b-card>
  </div>
</template>

<script>
const { MTProto } = require('@mtproto/core');

const api_id = process.env.VUE_APP_API_ID;
const api_hash = process.env.VUE_APP_API_HASH;

export default {
  data() {
    return {
      phone: '',
      code: ''
    }
  },
  mounted() {
    const mtproto = new MTProto({
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
