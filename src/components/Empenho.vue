<template>
  <v-container>

    <mensagem-dialog
        v-model="alerta"
        :tipo="tipoAlerta"
        :msg="messagemAlerta"
        @fechar="fecharAlerta"/>

    <h1>Gerenciamento de Empenhos</h1>

    <br />

    <h3>Cadastro de Empenho</h3>
    <validation-observer
        ref="observer"
        v-slot="{ invalid }"
    >
      <form @submit.prevent="submit">
        <v-row>
          <v-col cols="12" sm="6">
            <validation-provider
                v-slot="{ errors }"
                name="Número Empenho"
                rules="required|max:20"
            >
              <v-text-field
                  v-model="empenho.numeroEmpenho"
                  :counter="20"
                  :error-messages="errors"
                  label="Número Empenho"
                  required
              />
            </validation-provider>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col
              class="d-flex"
              cols="12"
              sm="6"
          >
            <v-select
                v-model="empenho.idCliente"
                :items="clientes"
                item-value="id"
                item-text="sigla"
                label="Clientes"
            ></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col sm="12">
            <v-card>
            <v-card-title>
              Itens
              <v-spacer></v-spacer>
              <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Pesquisar"
                  single-line
                  hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
                :search="search"
                v-model="selected"
                :headers="headers"
                :items="itens"
                :single-select="singleSelect"
                item-key="codigoItem"
                show-select
                class="elevation-1"
                :items-per-page="5"
            >
              <template v-slot:top>
                <v-switch
                    v-model="singleSelect"
                    label="Selecionar individual"
                    class="pa-3"
                />
              </template>

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
            </v-card>
          </v-col>

        </v-row>

        <v-row>
          <v-col cols="12" sm="4">
            <vuetify-money
                v-model="valorEmpenho"
                v-bind:label="label"
                v-bind:placeholder="placeholder"
                v-bind:readonly="readonly"
                v-bind:disabled="disabled"
                v-bind:outlined="outlined"
                v-bind:clearable="clearable"
                v-bind:valueWhenIsEmpty="valueWhenIsEmpty"
                v-bind:options="options"
                v-bind:properties="properties"
            >{{ soma }}</vuetify-money>
          </v-col>

        </v-row>
        {{ teste }}
        <v-row>
          <v-btn
              depressed
              class="mr-4"
              type="submit"
              color="green lighten-3"
              :disabled="invalid"
              @click="salvar"
          >
            Salvar
          </v-btn>

          <v-btn @click="clear">
            Cancelar
          </v-btn>

          <br />
        </v-row>

      </form>
    </validation-observer>

  </v-container>
</template>

<script>
import axios from "axios";
import { required, digits, max } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
import MensagemDialog from "./MensagemDialog";

setInteractionMode('eager')

extend('digits', {
  ...digits,
  message: '{_field_} deve possuir {length} digitos. ({_value_})',
})

extend('required', {
  ...required,
  message: '{_field_} não pode ser vazio',
})

extend('max', {
  ...max,
  message: '{_field_} deve possuir no máximo {length} caracteres.',
})


export default {
  name: "Empenho",
  components: {
    ValidationProvider,
    ValidationObserver,
    MensagemDialog,
  },
  data: () => ({

    search: '',
    itens: [],
    empenhos: [],
    clientes: [],
    cliente: {},
    empenho: {},
    valorEmpenho: '',
    urlItem: 'http://localhost:8081/item',
    urlEmpenho: 'http://localhost:8081/empenho',
    urlCliente: 'http://localhost:8081/cliente',
    codigoItem: '',
    descricao: '',
    label: 'Valor do Empenho',
    placeholder: '',
    readonly: false,
    disabled: false,
    outlined: true,
    clearable: true,
    valueWhenIsEmpty: "",
    options: {
      locale: "pt-BR",
      prefix: "R$",
      suffix: "",
      length: 11,
      precision: 2
    },
    properties: {
      hint: "Valor"
    },
    singleSelect: false,
    selected: [],
    headers: [
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
    messagemAlerta: '',
    alerta: false,
    tipoAlerta: 'success',
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {}

  }),
  mounted() {
    this.buscarItens(),
    this.buscarEmpenhos(),
    this.buscarClientes()
  },
  computed: {
    soma() {
      this.valorEmpenho = this.selected.reduce((acumulador, valorAtual) => {
      return acumulador + valorAtual.valorUnitario;
      }, 0);
    },
    teste() {
      this.empenho.itensDTO = this.selected;
      this.empenho.valor = this.valorEmpenho;
    }
  },
  methods: {
    submit () {
      this.$refs.observer.validate()
    },
    clear () {
      this.empenho = {};
      this.$refs.observer.reset()
    },
    async buscarItens() {
      let {data} = await axios.get(this.urlItem)
      this.itens = data
    },
    async buscarEmpenhos() {
      let {data} = await axios.get(this.urlEmpenho)
      this.empenhos = data
    },
    async buscarClientes() {
      let {data} = await axios.get(this.urlCliente)
      this.clientes = data
    },
    async salvar() {
      try {
        let {data} = await axios.post(this.urlEmpenho, this.empenho)
        this.empenhos.push(data)
        this.empenho = {}
        this.clear()
        this.abrirAlerta('Cadastro efetuado com sucesso!', 'success')
      } catch (err) {
        this.abrirAlerta('Não foi possível efetuar o cadastro :(', 'error')
      }
    },
    editItem (item) {
      this.editedIndex = this.itens.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    abrirAlerta(msg, tipo) {
      this.messagemAlerta = msg
      this.tipoAlerta = tipo
      this.alerta = true
      setTimeout(() => {
        this.fecharAlerta()
      }, 4000);
    },
    fecharAlerta() {
      this.messagemAlerta = ''
      this.alerta = false
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
  },
}
</script>
<style scoped>

</style>