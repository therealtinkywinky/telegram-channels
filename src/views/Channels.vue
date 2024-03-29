<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="primary">
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
            <logout v-on:overlay-on="overlay = true" v-on:overlay-off="overlay = false"></logout>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-overlay :show="overlay" variant="secondary">
      <b-container fluid class="min-vh-100">
        <b-row v-show="channel_index" class="pt-5">
          <b-col class="col-lg-6 mx-auto">

            <b-button-group class="mx-1">
              <b-button variant="danger" :disabled="message_index == 0" @click="$refs.carousel.prev()">Previous</b-button>
              <b-button disabled variant="outline-secondary">{{ message_index + 1 }} / {{ messages.length }}</b-button>
              <b-button variant="secondary" @click="loadMore">Load More...</b-button>
              <b-button variant="success" :disabled="message_index == messages.length - 1" @click="$refs.carousel.next()">Next</b-button>
            </b-button-group>

            <b-carousel ref="carousel" @sliding-end="onSlideEnd" :interval="0">
              <b-carousel-slide v-for="message in messages" class="min-vh-100">
                <document
                  v-if="message.type == 'document'"
                  v-on:overlay-on="overlay = true"
                  v-on:overlay-off="overlay = false"
                  :document="message.document">
                </document>

                <photo
                  v-else-if="message.type == 'photo'"
                  v-on:overlay-on="overlay = true"
                  v-on:overlay-off="overlay = false"
                  :text="message.text"
                  :photo="message.photo">
                </photo>
              </b-carousel-slide>
            </b-carousel>
          </b-col>
        </b-row>
      </b-container>
    </b-overlay>
  </div>
</template>

<script>
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
                document: message.media.document
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

.carousel-caption {
  width: 100%;
  top: 20px;
  left: 0px;
  right: 0px;
}
</style>
