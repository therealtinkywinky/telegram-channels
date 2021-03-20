<template>
  <b-button href="#" variant="warning" @click="download">Download</b-button>
</template>

<script>
import FileSaver from 'file-saver';

export default {
  name: 'download',
  props: [
    'document',
    'name'
  ],
  data() {
    return {
      i: -1,
      parts: [],
      mb: 1024 * 1024,
    }
  },
  methods: {
    download() {
      this.i++;
    }
  },
  computed: {
    n: function() {
      return Math.ceil(this.document.size / this.mb);
    },
    percent: function() {
      return Math.ceil((this.i * this.mb * 100) / this.document.size);
    }
  },
  watch: {
    i: function() {
      var self = this;

      self.$mtproto.call(
        'upload.getFile',
        {
          location: {
            _: 'inputDocumentFileLocation',
            id: self.document.id,
            access_hash: self.document.access_hash,
            file_reference: self.document.file_reference
          },
          offset: this.i * this.mb,
          limit: this.mb,
          flags: self.document.flags,
          precise: true,
          cdn_supported: false
        },
        {
          dcId: self.document.dc_id
        }
      ).then(result => {
        this.parts.push(result.bytes);

console.log(this.percent)

        self.$emit('progress', this.percent);

        if (this.i == this.n - 1)
          FileSaver.saveAs(new Blob(this.parts, { type: self.document.mime_type }), self.name);
        else
          this.i++;
      }).catch(error => {
        console.error(error);
      });
    }
  }
}
</script>
