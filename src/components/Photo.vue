<template>
  <b-card img-top bg-variant="transparent" header-bg-variant="transparent" footer-bg-variant="transparent" class="border-0">
    <b-card-text>{{ text }}</b-card-text>

    <template #header>
      <img :src="base64" />
    </template>

    <template #footer>
      <b-button v-show="!download" variant="warning" @click="viewPhoto">View</b-button>
      <b-button v-show="download" variant="warning" @click="downloadPhoto">Download</b-button>
    </template>
  </b-card>
</template>

<script>
import FileSaver from 'file-saver';

export default {
  name: 'photo',
  props: [
    'text',
    'photo'
  ],
  data() {
    return {
      bytes: null,
      download: false
    }
  },
  computed: {
    base64: function() {
      return this.bytes ? 'data:image/jpeg;base64,' + btoa(String.fromCharCode.apply(null, new Uint8Array(this.bytes))) : '';
    }
  },
  methods: {
    viewPhoto() {
      this.$emit('overlay-on');

      this.$mtproto.call(
        'upload.getFile',
        {
          offset: 0,
          limit: 1024 * 1024, // 1 MB
          flags: this.photo.flags,
          precise: true,
          cdn_supported: true,
          location: {
            _: 'inputPhotoFileLocation',
            id: this.photo.id,
            access_hash: this.photo.access_hash,
            file_reference: this.photo.file_reference,
            thumb_size: 'l'
          }
        },
        {
          dcId: this.photo.dc_id
        }
      ).then(response => {
        this.bytes = response.bytes;
        this.download = true;
      }).catch((error) => {
        console.log('error');
      }).finally(() => {
        this.$emit('overlay-off');
      });
    },
    downloadPhoto() {
      FileSaver.saveAs(new Blob([this.bytes], { type: 'image/jpeg' }), 'telegram.jpeg');
    }
  }
}
</script>

<style scoped>
img {
  width: 256px;
}
</style>
