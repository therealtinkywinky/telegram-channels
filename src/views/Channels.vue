<template>
  <div>
    <b-overlay :show="overlay" variant="secondary" no-wrap></b-overlay>

    <b-container fluid class="h-100">
      <b-row>
        <b-col>
          <b-input-group class="mt-3">
            <b-form-select v-model="channel_index">
              <b-form-select-option v-for="(channel, index) in channels" :value="index">{{ channel.title }}</b-form-select-option>
            </b-form-select>

            <b-form-input></b-form-input>

            <b-input-group-append>
              <b-button variant="info">Search</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <b-carousel
            :interval="4000"
            controls
            indicators
            background="#ababab"
            img-width="1024"
            img-height="480"
            style="text-shadow: 1px 1px 2px #333;">

            <b-carousel-slide v-for="message in messages" img-src="https://picsum.photos/1024/480/?image=54">
              <h1>{{ message.message }}</h1>
            </b-carousel-slide>
          </b-carousel>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
const { MTProto } = require('@mtproto/core');

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

      mtproto.call(
        'messages.getHistory',
        {
          peer: {
            '_': 'inputPeerChannel',
            channel_id: this.channels[index].id,
            access_hash: this.channels[index].access_hash
          },
          limit: 50,
          offset_id: 0
        }
      ).then(result => {
        console.log(result);
        this.messages = result.messages;
      }).catch(error => {
        console.error(error);
      });
    }
  },
  mounted() {
    mtproto = new MTProto({
      api_id,
      api_hash
    });

    mtproto.call('messages.getAllChats', { except_ids: [] }).then(result => {
      console.log(result);
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
</style>
