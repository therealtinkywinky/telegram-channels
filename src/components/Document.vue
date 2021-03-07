<template>
  <b-card img-top bg-variant="transparent" header-bg-variant="transparent" footer-bg-variant="transparent" class="border-0">
    <b-card-text>{{ filename }} {{ size }}</b-card-text>

    <b-button href="#" variant="warning">Download</b-button>

    <template #header>
      <img style="width:256px;" src="@/assets/download.png" />
    </template>

    <template #footer>
      <b-progress value="43" max="100" variant="danger" height="30px" show-progress animated></b-progress>
    </template>
  </b-card>
</template>

<script>
export default {
  name: 'document',
  props: [
    'filename',
    'size'
  ]
}
</script>
