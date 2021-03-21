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
      mime: '',
      extension: '',
      download: false,

      i: -1,
      parts: [],
      mb: 1024 * 1024,
    }
  },
  computed: {
    base64: function() {
      return this.download ? 'data:' + this.mime + ';base64,' + btoa(String.fromCharCode.apply(null, this.parts)) : require('../assets/photo.png');
    }
  },
  methods: {
    viewPhoto() {
      this.$emit('overlay-on');

      this.i++;
    },
    downloadPhoto() {
      FileSaver.saveAs(new Blob([this.parts], { type: this.mime }), this.photo.id + '.' + this.extension);
    },
    setMIMEAndExtension(type) {
      var mime = '';
      var extension = '';

      switch (type) {
        case 'storage.fileJpeg':
          mime = 'image/jpeg';
          extension = 'jpg';

          break;
        case 'storage.fileGif':
          mime = 'image/gif';
          extension = 'gif';

          break;
        case 'storage.filePng':
          mime = 'image/png';
          extension = 'png';

          break;
      }

      this.mime = mime;
      this.extension = extension;
    }
  },
  watch: {
    i: function() {
      this.$mtproto.call(
        'upload.getFile',
        {
          location: {
            _: 'inputPhotoFileLocation',
            id: this.photo.id,
            access_hash: this.photo.access_hash,
            file_reference: this.photo.file_reference,
            thumb_size: 'l'
          },
          flags: this.photo.flags,
          offset: this.i * this.mb,
          limit: this.mb,
          precise: true,
          cdn_supported: false
        },
        {
          dcId: this.photo.dc_id
        }
      ).then(response => {
        var _parts = new Uint8Array(this.parts.length + response.bytes.length);

        _parts.set(this.parts);
        _parts.set(response.bytes, this.parts.length);

        this.parts = _parts;

        if (response.type._ == 'storage.filePartial')
          this.i++;
        else {
          this.setMIMEAndExtension(response.type._);
          this.download = true;
        }
      }).catch(error => {
        console.log(error);
      }).finally(() => {
        this.$emit('overlay-off');
      });
    }
  }
}
</script>

<style scoped>
img {
  width: 256px;
}
</style>
