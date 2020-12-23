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
        {{ soma }}
        <v-row align="center">
          <v-col
              class="d-flex"
              cols="12"
              sm="6"
          >
            <v-select
                :items="clientes"
                item-value="id"
                item-text="sigla"
                label="Clientes"
            ></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col sm="8">
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
            />
          </v-col>

        </v-row>

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
        value: 'descricao'
      },
      {
        text: 'Valor',
        value: 'valorUnitario'
      }

    ],
    messagemAlerta: '',
    alerta: false,
    tipoAlerta: 'success'

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
    }
  },
}
</script>
<style scoped>

</style>