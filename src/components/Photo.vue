<template>
  <b-card img-top bg-variant="transparent" header-bg-variant="transparent" footer-bg-variant="transparent" class="border-0">
    <b-card-text>{{ text }}</b-card-text>

    <template #header>
      <img :src="base64" />
    </template>
  </b-card>
</template>

<script>
export default {
  name: 'photo',
  props: [
    'text',
    'base64'
  ]
}
</script>

<style scoped>
img {
  width: 256px;
}
</style>
