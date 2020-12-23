<template>
  <core-view/>
</template>

<script>
import CadastroItem from '@/components/CadastroItem.vue';
import CoreView from "@/components/CoreView";
import Clientes from "@/components/Clientes";

export default {
  name: 'App',

  components: {
    CoreView,
    CadastroItem,
    Clientes
  },

  data: () => ({
    //
  }),
};
</script>
