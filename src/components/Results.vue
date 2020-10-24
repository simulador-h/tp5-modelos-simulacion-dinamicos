<template>
  <q-page padding />
</template>

<style lang="scss" scoped>

</style>

<script lang="ts">
  import {
    defineComponent,
    PropType,
  } from '@vue/composition-api';

  export interface IResults {
    tiempoEntrePedidos: {
      promedio: number
      desviacion: number
    }
  }

  export default defineComponent({
    name: 'Simulation',
    components: {},
    props: {
      results: {
        required: true,
        type: Object as PropType<IResults>,
      },
    },
  });
</script>
