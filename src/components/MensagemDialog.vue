<template>
    <v-alert v-model="value" class="alerta" :type="tipo">
        {{ msg }}
        <template v-slot:close>
            <v-btn icon @click="fechar">
                <v-icon>mdi-close-circle</v-icon>
            </v-btn>
        </template>
    </v-alert>
</template>

<script>
    export default {
        name: "MensagemDialog",
        props:{
            value: {
                type: Boolean,
                required: true
            },
            tipo: {
                type: String,
                default: 'success'
            },
            msg: String
        },
        methods:{
            fechar(){
                this.$emit('fechar')
            }
        }
    }
</script>

<style scoped>
    .alerta{
        position: absolute;
        right: 10px;
        top: 10px;
    }
</style>