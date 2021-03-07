<template>
  <b-icon-power @click="logout"></b-icon-power>
</template>

<script>
const { MTProto } = require('@mtproto/core');

var mtproto;
const api_id = process.env.VUE_APP_API_ID;
const api_hash = process.env.VUE_APP_API_HASH;

mtproto = new MTProto({
  api_id,
  api_hash
});

export default {
  name: 'logout',
  methods: {
    logout() {
      mtproto.call('auth.logOut').then(() => { this.$router.push('/') });
    }
  },
}
</script>
