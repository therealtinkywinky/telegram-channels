<template>
  <b-icon-power @click="logout"></b-icon-power>
</template>

<script>
export default {
  name: 'logout',
  methods: {
    logout() {
      this.$emit('overlay-on');

      this.$mtproto.call('auth.logOut').then(() => {
        this.$emit('overlay-off');
        this.$router.push('/login')
      });
    }
  },
}
</script>
