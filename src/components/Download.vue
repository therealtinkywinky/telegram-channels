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
  methods: {
    download() {
      var mb = 1024 * 1024;
      var n = Math.ceil(this.document.size / mb);
      var parts = [];
      var i = 0;
      var locked = false;
      var self = this;

      var interval = setInterval(function() {
        if (locked)
          return;
        else
          locked = true;

        self.$mtproto.call(
          'upload.getFile',
          {
            location: {
              _: 'inputDocumentFileLocation',
              id: self.document.id,
              access_hash: self.document.access_hash,
              file_reference: self.document.file_reference
            },
            offset: i * mb,
            limit: mb,
            flags: self.document.flags,
            precise: true,
            cdn_supported: false
          },
          {
            dcId: self.document.dc_id
          }
        ).then(result => {
          locked = false;
          parts.push(result.bytes);

          self.$emit('progress', Math.ceil(((i * mb) * 100) / self.document.size));

          if (i == n - 1) {
            FileSaver.saveAs(new Blob(parts, { type: self.document.mime_type }), self.name);

            clearInterval(interval);
          }

          i++;
        }).catch(error => {
          console.error(error);
        });
      }, 1000);
    }
  }
}
</script>
