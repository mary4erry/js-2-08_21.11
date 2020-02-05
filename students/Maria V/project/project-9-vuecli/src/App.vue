<template>
  <div id="app">
    <header>
      <div class="logo">E-shop</div>
      <div class="cart">
                  <!-- <filter-comp></filter-comp> -->
          <button class="btn-cart" type="button" @click = "cartShown = !cartShown">Корзина</button>
                  <!-- <div class="cart-block" v-if = "cartShown"></div> -->
          <cart ref="cart" v-show="cartShown"></cart>
      </div>
    </header>
    <main>
      <catalog ref='cat'></catalog>
    </main>
  </div>
</template>

<script>

import catalog from './components/catalog'
export default {
  name: 'app',
  data: function () {
    return {

    }
  },
  methods: {
    getJSON (url) {
      return fetch (url)
        .then ( result => result.json())
        .catch (err => {
            console.log (err)
        })
      },
    postJSON (url, data) {
      return fetch (url, {
          method: 'POST',
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify (data)
      }) 
      .then ( result => result.json())
      .catch (err => {
          console.log (err)
      })
    },
    putJSON (url, data) {
      return fetch (url, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify (data)
      }) 
      .then ( result => result.json())
      .catch (err => {
          console.log (err)
      })
    },
    deleteJSON (url) {
      return fetch (url, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
      }) 
      .then ( result => result.json())
      .catch (err => {
          console.log (err)
      })
    },
  },
  components: {
    catalog
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
