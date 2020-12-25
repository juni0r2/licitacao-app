<template>
  <v-navigation-drawer
      app
      clipped
      :mini-variant.sync="mini"
      mini-variant-width="60"
      mobile-breakpoint="720"
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          JL COMERCIO PRODUTOS <br>
          ALIMENTICIOS
        </v-list-item-title>
        <v-list-item-subtitle>
          Gerenciamento de Empenhos
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list
        dense
        nav
    >
    <v-list-item
        v-for="item in items"
        :key="item.title"
        link
        :to="item.to"
    >
      <v-list-group
          no-action
      >

        <template v-slot:activator>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
            v-for="sub in item.subitem"
            :key="sub.title"
            link
            :to="sub.to"
        >
          <v-list-item-title>{{sub.title}}</v-list-item-title>

          <v-list-item-icon>
            <v-icon>{{sub.icon}}</v-icon>
          </v-list-item-icon>

        </v-list-item>

      </v-list-group>
    </v-list-item>


    </v-list>

    <div class="drawer-bottom">
      <v-divider></v-divider>

      <div @click="mini=!mini">
        <v-btn :icon="mini" text >
          <v-icon>{{ mini ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
          <a v-if="!mini">Recolher menu</a>
        </v-btn>

      </div>
    </div>

  </v-navigation-drawer>
</template>

<script>
export default {
  name: "MenuLateral",
  data () {
    return {
      admins: [
        ['Management', 'mdi-account-multiple-outline'],
        ['Settings', 'mdi-cog-outline'],
      ],
      cruds: [
        ['Create', 'mdi-plus-outline'],
        ['Read', 'mdi-file-outline'],
        ['Update', 'mdi-update'],
        ['Delete', 'mdi-delete'],
      ],
      items: [
        { title: 'Empenhos',
          icon: 'mdi-sitemap',
          to:'/',
          subitem: [
            {
              title: 'Cadastro',
              icon: 'mdi-account-multiple',
              to:'/clientes'
            }
          ]
        },
        {
          title: 'Itens',
          icon: 'mdi-animation',
          to:'/itens'
        },
        { title: 'Clientes',
          icon: 'mdi-account-multiple',
          to:'/clientes'
        }
      ],
      right: null,
      mini: false
    }
  },
}
</script>

<style scoped>

  .drawer-bottom {
    position: absolute;
    bottom: 0;
    width: 100%;
  }

  .drawer-bottom a {
    color: darkgray;
  }

</style>