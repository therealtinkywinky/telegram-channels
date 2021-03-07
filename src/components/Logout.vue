<template>
  <b-icon-power @click="logout"></b-icon-power>
</template>

<script>
export default {
  name: 'logout',
  methods: {
    logout() {
      this.$mtproto.call('auth.logOut').then(() => { this.$router.push('/') });
    }
  },
}
</script>
