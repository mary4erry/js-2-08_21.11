<template>
    <div class="products">
        <item v-for="product of items" :item="product" :imgProp="imgCatalog"></item>
    </div>
</template>
<script>
import product from './product'

export default {
    data () {
        return {
            imgCatalog: 'https://placehold.it/200x150',
            products: [],
            filtered: [],
        }
    }, 
    mounted () {
        this.$parent.getJSON ('/catalog')
            .then (data => this.items = data)
    }, 
    components: {
            item
        },
}
</script>

<style>

</style>