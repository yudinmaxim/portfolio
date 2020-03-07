<template>
    <div class="products_page pg_0">
        <Unit 
          v-for="unit in units" 
          :unit="unit"
          :key="unit.code"/>
    </div>
</template>

<script>
import Unit from "./Unit.vue";

const UNIT_DATA_URL = "./products.json";


export default {
    name: "UnitList",
    components: {
        Unit
    },
    data: function() {
        return {
          units : [],

        };
    },

    async mounted() {
        try {
            const unitData = await fetch(UNIT_DATA_URL);
            this.units = await unitData.json();

        } catch (error) {
            console.log(`mounted() => ${error}`);
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
