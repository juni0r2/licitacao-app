<template>
    <v-container>

        <mensagem-dialog
          v-model="alerta"
          :tipo="tipoAlerta"
          :msg="messagemAlerta"
          @fechar="fecharAlerta"/>

        <h1>Gerenciamento de Itens</h1>

        <br />

        <h3>Cadastro de Item</h3>
        <validation-observer
        ref="observer"
        v-slot="{ invalid }"
        >
            <form @submit.prevent="submit">
                <v-row>
                    <v-col cols="12" sm="2">
                        <validation-provider
                            v-slot="{ errors }"
                            name="Código Item"
                            rules="required|max:10"
                        >
                            <v-text-field
                                v-model="item.codigoItem"
                                :counter="10"
                                :error-messages="errors"
                                label="Código item"
                                required
                                type="number"></v-text-field>
                        </validation-provider>
                    </v-col>
                </v-row>

                <v-row >
                    <v-col cols="12" sm="10">
                        <validation-provider
                            v-slot="{ errors }"
                            name="descricao"
                            rules="required|max:50"
                        >
                            <v-text-field
                                style=""
                                v-model="item.descricao"
                                :counter="50"
                                :error-messages="errors"
                                label="Descrição"
                                required
                            ></v-text-field>
                        </validation-provider>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12" sm="2">
                        <vuetify-money
                        v-model="item.valorUnitario"
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
                </v-row>

            </form>
        </validation-observer>

        <h3 class="mt-10">Listagem de Itens</h3>
            <v-row>
                <v-col sm="8">
                    <v-data-table
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
                            ></v-switch>
                        </template>
                    </v-data-table>
                </v-col>

            </v-row>

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
    name: "Cadastro",
    components: {
      ValidationProvider,
      ValidationObserver,
      MensagemDialog,
    },
    data: () => ({

        item: {},
        urlItem: 'http://localhost:8081/item',
        codigoItem: '',
        descricao: '',
        value: '',
        label: '',
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
            hint: "Valor do item"
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
        itens: [],
        messagemAlerta: '',
        alerta: false,
        tipoAlerta: 'success'
        
    }),
    mounted() {
        this.buscarItens()
    },
    methods: {
        submit () {
            this.$refs.observer.validate()
        },
        clear () {
            this.item = {};
            this.$refs.observer.reset()
        },
        async buscarItens() {
            let {data} = await axios.get(this.urlItem)
            console.log(data)
            this.itens = data
        },
        async salvar() {
            try {
                let {data} = await axios.post(this.urlItem, this.item)
                this.itens.push(data)
                this.item = {}
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