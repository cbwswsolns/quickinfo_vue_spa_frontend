<template>

  <b-card>

    <b-card-body>

        <b-list-group>
            <h2 align="center">Quick Info Search</h2>
            <b-input-group-text>
                <b-input label="Search" type="text" v-model="search" placeholder="Search for info..." />
                <span class="input-group-text">Total: {{total}}</span>
            </b-input-group-text>
            <br>
        </b-list-group>

        <br>

        <b-card v-for="item in infoItems" v-bind:key="item.id" text-variant="black">
          <b-card-body class="text-left">
            <b-card-title>{{ item.term }}</b-card-title>
            <b-card-text v-html="item.definition">{{ item.definition }}</b-card-text>
          </b-card-body>
        </b-card>

    </b-card-body>

  </b-card>

</template>

<script>

  import axios from "axios";
  export default { 
    data() {
      return {
        infoItems: [],
        search: '',
        total: 0,
        user: this.$store.state.auth.user
      };
    },
    watch:{
      search() {
        return this.getSearch();
      }
    },
    methods: {
      getSearch() {

        // Only make axios call for non null query string
        if (this.search.length > 0) {
          axios.get('/api/search', {params: {searchquery: this.search}}).then(response => {
              this.infoItems = response.data.data;
              this.total = response.data.total;

            });

        } else {
          this.infoItems = [];
          this.total = 0;

        }
      }
    }
  };

</script>
