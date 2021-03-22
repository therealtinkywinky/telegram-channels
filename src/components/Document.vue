<template>
  <b-card img-top bg-variant="transparent" header-bg-variant="transparent" footer-bg-variant="transparent" class="border-0">
    <b-card-text>{{ name }} {{ size }}</b-card-text>

    <download :document="document" :name="name" v-on:progress="progress = $event"></download>

    <template #header>
      <img src="@/assets/document.png" />
    </template>

    <template #footer>
      <b-progress max="100" variant="success" height="30px" show-progress animated>
        <b-progress-bar :value="progress">
          <strong>{{ progress }}%</strong>
        </b-progress-bar>
      </b-progress>
    </template>
  </b-card>
</template>

<script>
import xbytes from 'xbytes';
import Download from './Download';

export default {
  components: {
    Download
  },
  name: 'document',
  props: [
    'document'
  ],
  data() {
    return {
      progress: ''
    }
  },
  methods: {
    getFilename(attributes) {
      var filename = "";

      attributes.forEach(attribute => {
        if (attribute._ == 'documentAttributeFilename')
          filename = attribute.file_name;
      });

      return filename;
    }
  },
  computed: {
    name: function() {
      return this.getFilename(this.document.attributes)
    },
    size: function() {
      return xbytes(this.document.size)
    }
  }
}
</script>

<style scoped>
img {
  width: 128px;
}
</style>
