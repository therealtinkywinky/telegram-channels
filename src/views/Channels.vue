<template>
  <div>
    <b-overlay :show="overlay" variant="secondary" no-wrap></b-overlay>

    <b-container fluid class="h-100">
      <b-row align-v="center" class="h-100">
        <b-col>
          <b-table striped hover :items="items"></b-table>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      overlay: true,
      items: []
    }
  }
}
</script>
