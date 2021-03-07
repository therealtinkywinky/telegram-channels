<template>
  <div>
    <b-overlay :show="overlay" variant="secondary" no-wrap></b-overlay>

    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-form>
            <b-form-select v-model="channel_index">
              <b-form-select-option v-for="(channel, index) in channels" :value="index">{{ channel.title }}</b-form-select-option>
            </b-form-select>
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-container fluid>
      <b-row>
        <b-col class="col-lg-6 mx-auto">
          <b-carousel controls indicators ref="carousel">
            <b-carousel-slide v-for="message in messages" img-blank img-height="550">

              <template #default>
                <div v-if="message.type == 'document'">
                  <b-card img-top bg-variant="transparent" header-bg-variant="transparent" footer-bg-variant="transparent" class="border-0">
                    <b-card-text>{{ message.filename }} {{ message.size }}</b-card-text>

                    <b-button href="#" variant="warning">Download</b-button>

                    <template #header>
                      <img style="width:256px;" src="@/assets/download.png" />
                    </template>

                    <template #footer>
                      <b-progress value="43" max="100" variant="danger" height="30px" show-progress animated></b-progress>
                    </template>
                  </b-card>
                </div>
                <div v-else-if="message.type == 'photo'">
                  <b-card img-top bg-variant="transparent" header-bg-variant="transparent" footer-bg-variant="transparent" class="border-0">
                    <b-card-text>{{ message.text }}</b-card-text>

                    <template #header>
                      <img style="width:256px;" :src="message.base64" />
                    </template>
                  </b-card>
                </div>
              </template>

            </b-carousel-slide>
          </b-carousel>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
const { MTProto } = require('@mtproto/core');
import xbytes from 'xbytes';

var mtproto;
const api_id = process.env.VUE_APP_API_ID;
const api_hash = process.env.VUE_APP_API_HASH;

export default {
  data() {
    return {
      overlay: true,
      channels: [],
      messages: [],

      channel_index: 0
    }
  },
  watch: {
    channel_index: function(index) {

      this.overlay = true;

      mtproto.call(
        'messages.getHistory',
        {
          peer: {
            _: 'inputPeerChannel',
            channel_id: this.channels[index].id,
            access_hash: this.channels[index].access_hash
          },
          limit: 5,
          offset_id: 0
        }
      ).then(result => {
        this.overlay = false;
        this.messages = [];

        result.messages.forEach((message, index) => {
          if (message.flags & 512) { // Media
            if (message.media._ == 'messageMediaDocument') {
              this.messages[index] = {
                type: 'document',
                mime: message.media.document.mime_type,
                size: xbytes(message.media.document.size)
              };

              message.media.document.attributes.forEach((attribute) => {
                if (attribute._ == 'documentAttributeFilename')
                  this.messages[index].filename = attribute.file_name;
              });
            } else if (message.media._ == 'messageMediaPhoto') {
              this.messages[index] = {
                type: 'photo',
                text: message.message
              }

              mtproto.call(
                'upload.getFile',
                {
                  offset: 0,
                  limit: 1024 * 1024,
                  flags: message.media.photo.flags,
                  precise: true,
                  cdn_supported: true,
                  location: {
                    _: 'inputPhotoFileLocation',
                    id: message.media.photo.id,
                    access_hash: message.media.photo.access_hash,
                    file_reference: message.media.photo.file_reference,
                    thumb_size: 'l'
                  }
                },
                {
                  dcId: message.media.photo.dc_id
                }
              ).then((response) => {
                var u8 = new Uint8Array(response.bytes);
                var base64 = btoa(String.fromCharCode.apply(null, u8));

                this.messages[index].base64 = 'data:image/jpeg;base64,' + base64;

                this.messages = Object.assign({}, this.messages);
              }).catch((error) => {
                console.log('error');
              });
            }
          }
        });
      }).catch(error => {
        console.error(error);
      });
    }
  },
  mounted() {
    this.$refs.carousel.pause();

    mtproto = new MTProto({
      api_id,
      api_hash
    });

    mtproto.call('messages.getAllChats', { except_ids: [] }).then(result => {
      this.channels = result.chats;
    }).catch(error => {
      console.error(error);
    }).finally(() => {
      this.overlay = false;
    });
  }
}
</script>

<style>
table > thead {
  display: none;
}

table > tbody > tr {
  cursor: pointer;
}

.card-header, .card-footer {
  border: 0px;
}
</style>
