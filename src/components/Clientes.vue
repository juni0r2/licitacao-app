<template>
    <v-container>

        <mensagem-dialog
          v-model="alerta"
          :tipo="tipoAlerta"
          :msg="messagemAlerta"
          @fechar="fecharAlerta"/>

        <h1>Gerenciamento de Clientes</h1>

        <br/>
        <h3>Cadastro de Cliente</h3>
        <validation-observer
        ref="observer"
        v-slot="{ invalid }"
        >
            <form @submit.prevent="submit">
                <v-row>
                    <v-col cols="12" sm="10">
                        <validation-provider
                            v-slot="{ errors }"
                            name="Sigla"
                            rules="required|max:50"
                        >
                            <v-text-field
                                v-model="cliente.sigla"
                                :error-messages="errors"
                                label="Sigla"
                                :counter="50"
                                required
                            />
                        </validation-provider>
                    </v-col>
                </v-row>

                <v-row >
                    <v-col cols="12" sm="10">
                        <validation-provider
                            v-slot="{ errors }"
                            name="Nome"
                            rules="required|max:100"
                        >
                            <v-text-field
                                v-model="cliente.nome"
                                :counter="100"
                                :error-messages="errors"
                                label="Nome"
                                required
                            ></v-text-field>
                        </validation-provider>
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

        <h3 class="mt-10">Listagem de clientes</h3>
            <v-row>
                <v-col sm="8">
                    <v-data-table
                        v-model="selected"
                        :headers="headers"
                        :items="clientes"
                        :single-select="singleSelect"
                        cliente-key="id"
                        show-select
                        class="elevation-1"
                        :clientes-per-page="5"
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
        clientes: [],
        cliente: {},
        urlCliente: 'http://localhost:8081/cliente',
        singleSelect: false,
        selected: [],
        headers: [
            {
                text: 'Sigla',
                value: 'sigla'
            },
            { 
                text: 'Nome',
                value: 'nome'
            }
          
        ],
        messagemAlerta: '',
        alerta: false,
        tipoAlerta: 'success'
        
    }),
    mounted() {
        this.buscarclientes()
    },
    methods: {
        submit () {
            this.$refs.observer.validate()
        },
        clear () {
            this.cliente = {};
            this.$refs.observer.reset()
        },
        async buscarclientes() {
            let {data} = await axios.get(this.urlCliente)
            this.clientes = data
        },
        async salvar() {
            try {
                let {data} = await axios.post(this.urlCliente, this.cliente)
                this.clientes.push(data)
                this.cliente = {}
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