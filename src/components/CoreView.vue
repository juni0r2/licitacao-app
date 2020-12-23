<template>
  <v-app>
    <menu-lateral/>
    <v-main>
      <v-container class="pa-10" fluid>
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import MenuLateral from "@/components/MenuLateral";
export default {
  name: "CoreView",
  components: {MenuLateral},
}
</script>

<style scoped>

</style>