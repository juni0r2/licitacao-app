<template>
  <core-view/>
</template>

<script>
import Item from '@/components/Item.vue';
import CoreView from "@/components/CoreView";
import Clientes from "@/components/Clientes";

export default {
  name: 'App',

  components: {
    CoreView,
    Item,
    Clientes
  },

  data: () => ({
    //
  }),
};
</script>
