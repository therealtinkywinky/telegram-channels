<template>
  <b-card bg-variant="dark" style="max-width: 20%" class="mx-auto mb-5">
    <canvas id="canvas"></canvas>
  </b-card>
</template>

<script>
import QRCode from 'qrcode';

export default {
  name: 'qr',
  data() {
    return {
      qr: '',
      expires: 0
    }
  },
  mounted() {
    setInterval(() => {
      var now = Math.floor(Date.now() / 1000);

      if (now > this.expires)
        this.$mtproto.call('auth.exportLoginToken', { except_ids: [] })
          .then((response) => {
            this.expires = response.expires;

            var u8 = new Uint8Array(response.token);
            var base64 = btoa(String.fromCharCode.apply(null, u8));
            var qr = 'tg://login?token=' + base64;

            QRCode.toCanvas(document.getElementById('canvas'), qr, function(error) {
              if (error) console.error(error)
            });
          }).catch(() => {
            console.log(456);
          });
    }, 1000);
  }
}
</script>
