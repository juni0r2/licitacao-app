<template>

  <v-data-table
      :headers="headers"
      :items="empenhos"
      :single-expand="expandirApenasUm"
      :expanded.sync="expandir"
      item-key="numeroEmpenho"
      class="elevation-1"
      show-expand
      :search="pesquisar"
  >
    <template v-slot:item.dataCriacao="{ item }">
      {{ formatarData(item) }}
    </template>
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Empenhos</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-switch
            v-model="expandirApenasUm"
            label="Expandir Um"
            class="mt-2"
        ></v-switch>
      </v-toolbar>
    </template>

    <template v-slot:expanded-item="{ headers, item }">

      <td :colspan="headers.length">
        <v-data-table
            :headers="headersItem"
            :items="item.itens"
            item-key="codigoItem"
            class="elevation-1"
            hide-default-footer
            dark
        >

          <template v-slot:item.actions="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                    small
                    class="mr-2"
                    @click="editItem(item)"
                    v-bind="attrs"
                    v-on="on"
                >
                  mdi-truck-delivery
                </v-icon>
              </template>
              <span>Entregar</span>
            </v-tooltip>
          </template>

          <template v-slot:item.quantidadeTotal="{ item }">
            <v-chip
                :color="getColorTotal(item.quantidadeTotal)"
                dark
            >
              {{ item.quantidadeTotal }}
            </v-chip>
          </template>
          <template v-slot:item.quantidadeEntregue="{ item }">
            <v-chip
                :color="getColorEntregue(item.quantidadeEntregue, item.quantidadeTotal)"
                dark
            >
              {{ item.quantidadeEntregue }}
            </v-chip>
          </template>
          <template v-slot:item.quantidadeAEntregar="{ item }">
            <v-chip
                :color="getColorEntregar(item.quantidadeAEntregar, item.quantidadeTotal)"
                dark
            >
              {{ item.quantidadeAEntregar }}
            </v-chip>
          </template>

        </v-data-table>
      </td>
    </template>
  </v-data-table>

</template>

<script>
import axios from "axios";
import moment from 'moment'

export default {
  name: "ListaEmpenhos",
  data: () => ({

    urlEmpenho: 'http://localhost:8081/empenho',
    urlItem: 'http://localhost:8081/item',
    pesquisar: '',
    expandir: [],
    expandirApenasUm: false,
    empenhos: [],
    itens: [],
    headers : [
      {
        text: 'Número Empenho',
        align: 'start',
        sortable: false,
        value: 'numeroEmpenho',
      },
      {
        text: 'Cliente',
        value: 'cliente.sigla',
      },
      {
        text: 'Valor',
        value: 'valor'
      },
      {
        text: 'Data',
        value: 'dataCriacao'
      }
    ],
    headersItem: [
      {
        text: 'Código',
        align: 'start',
        sortable: false,
        value: 'codigoItem',
      },
      {
        text: 'Descrição',
        value: 'descricao',
      },
      {
        text: 'Valor',
        value: 'valorUnitario'
      },
      {
        text: 'Qtde Total',
        value: 'quantidadeTotal'
      },
      {
        text: 'Qtde Entregue',
        value: 'quantidadeEntregue'
      },
      {
        text: 'Qtde Entregar',
        value: 'quantidadeAEntregar'
      },
      {
        text: 'Ações',
        value: 'actions',
        sortable: false
      },

    ],
  }),
  mounted() {
    this.buscarEmpenhos();
    this.bucarItens();
  },

  methods: {
    formatarData(value) {
      return moment(value).format('DD/MM/YYYY')
    },
    async buscarEmpenhos() {
      let {data} = await axios.get(this.urlEmpenho)
      this.empenhos = data
    },
    async bucarItens() {
      let {data} = await axios.get(this.urlItem)
      this.itens = data
    },
    getColorTotal (quantidadeTotal) {
      if (quantidadeTotal >= 1) return 'blue'
      else return 'green'
    },
    getColorEntregue(quantidadeEntregue, quantidadeTotal) {
      if (quantidadeEntregue >= quantidadeTotal) return 'blue'
      else return 'green'
    },
    getColorEntregar(quantidadeEntregar, quantidadeTotal) {
      if (quantidadeEntregar <= quantidadeTotal) return 'orange'
      else return 'gray'
    },
  }
}
</script>

<style scoped>

</style>