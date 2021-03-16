<template>
  <div>
    <b-overlay :show="overlay" variant="secondary" no-wrap></b-overlay>

    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-collapse is-nav>
        <b-navbar-nav>
          <b-nav-form>
            <b-form-select v-model="channel_index">
              <b-form-select-option v-for="(channel, index) in channels" :value="index">{{ channel.title }}</b-form-select-option>
            </b-form-select>
          </b-nav-form>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item>
            <logout></logout>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-container fluid>
      <b-row v-show="channel_index" class="mt-5">
        <b-col class="col-lg-6 mx-auto">
          <b-button disabled variant="outline-primary">{{ message_index + 1 }} / {{ messages.length }}</b-button>

          <b-button-group class="mx-1">
            <b-button variant="danger" :disabled="message_index == 0" @click="$refs.carousel.prev()">Previous</b-button>
            <b-button variant="success" :disabled="message_index == messages.length - 1" @click="$refs.carousel.next()">Next</b-button>
          </b-button-group>

          <b-carousel ref="carousel" @sliding-end="onSlideEnd" :interval="0">
            <b-carousel-slide v-for="message in messages" img-blank img-height="550">
              <template #default>
                <document v-if="message.type == 'document'" :name="message.name" :size="message.size"></document>
                <photo
                  v-else-if="message.type == 'photo'"
                  v-on:overlay-on="overlay = true"
                  v-on:overlay-off="overlay = false"
                  :text="message.text"
                  :photo="message.photo">
                </photo>
              </template>
            </b-carousel-slide>
          </b-carousel>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import xbytes from 'xbytes';
import Logout from '../components/Logout';
import Document from '../components/Document';
import Photo from '../components/Photo';

export default {
  components: {
    Logout,
    Document,
    Photo
  },
  data() {
    return {
      overlay: true,

      channels: [],
      messages: [],

      channel_index: 0,
      message_index: 0
    }
  },
  methods: {
    onSlideEnd(slide) {
      this.message_index = slide;
    },
    getFilename(attributes) {
      var filename = "";

      attributes.forEach(attribute => {
        if (attribute._ == 'documentAttributeFilename')
          filename = attribute.file_name;
      });

      return filename;
    },
    loadMore() {
      this.overlay = true;

      this.$mtproto.call(
        'messages.getHistory',
        {
          peer: {
            _: 'inputPeerChannel',
            channel_id: this.channels[this.channel_index].id,
            access_hash: this.channels[this.channel_index].access_hash
          },
          limit: 5,
          add_offset: this.message_index
        }
      ).then(result => {
        this.overlay = false;

        result.messages.forEach(message => {
          if (message.flags & 512) { // Media
            if (message.media._ == 'messageMediaDocument')
              this.messages.push({
                type: 'document',
                mime: message.media.document.mime_type,
                size: xbytes(message.media.document.size),
                name: this.getFilename(message.media.document.attributes)
              });
            else if (message.media._ == 'messageMediaPhoto')
              this.messages.push({
                type: 'photo',
                text: message.message,
                photo: message.media.photo
              });
          }
        });
      }).catch(error => {
        console.error(error);
      });
    }
  },
  watch: {
    channel_index: function(index) {
      this.messages = [];
      this.message_index = 0;

      this.loadMore();
    },
    message_index: function(index) {
      if (index == this.messages.length - 1)
        this.loadMore();
    }
  },
  mounted() {
    this.$mtproto.call('messages.getAllChats', { except_ids: [] }).then(result => {
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
.card-header, .card-footer {
  border: 0px;
}
</style>
