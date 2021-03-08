<template>
  <b-card img-top bg-variant="transparent" header-bg-variant="transparent" footer-bg-variant="transparent" class="border-0">
    <b-card-text>{{ filename }} {{ size }}</b-card-text>

    <download></download>

    <template #header>
      <img src="@/assets/download.png" />
    </template>

    <template #footer>
      <b-progress value="43" max="100" variant="danger" height="30px" show-progress animated></b-progress>
    </template>
  </b-card>
</template>

<script>
import Download from './Download';

export default {
  components: {
    Download
  },
  name: 'document',
  props: [
    'filename',
    'size'
  ]
}
</script>

<style scoped>
img {
  width: 256px;
}
</style>
