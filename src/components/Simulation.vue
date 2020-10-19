<template>
  <q-page padding>
    <q-form novalidate @submit.prevent="onSubmit">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-5">
          <q-card flat bordered class="full-height">
            <q-card-section class="row items-center justify-between">
              <span class="text-uppercase text-caption text-primary">
                Configuración
              </span>
              <q-icon name="fas fa-cog" class="text-primary" />
            </q-card-section>

            <q-separator inset />

            <q-card-section>
              <q-input
                v-model.number="iteraciones"
                label="Número de réplicas"
                type="number"
                required
                outlined stack-label
                hide-bottom-space lazy-rules
                :rules="[v.required(), v.gte(0)]"
              />
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-5">
          <q-card flat bordered class="full-height">
            <q-card-section class="row items-center justify-between">
              <span class="text-uppercase text-caption text-primary">
                Muestreo
              </span>
              <q-icon name="fas fa-eye-dropper" class="text-primary" />
            </q-card-section>

            <q-separator inset />

            <q-card-section>
              <q-input
                v-model="condicionMuestreo"
                label="Condición"
                type="textarea"
                required
                outlined stack-label
                hide-bottom-space lazy-rules
                :rules="[v.required(), v.js()]"
              />
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-2 row justify-end">
          <q-btn label="Simular" type="submit" color="primary" class="full-width" />
        </div>
      </div>
    </q-form>

    <q-table
      title="Pizzería"
      class="q-mt-md"
      flat dense bordered
      row-key="id"
      :columns="columnas"
      :visible-columns="columnasVisibles"
      :data="vectores"
      :loading="loading"
      :pagination="{
        sortBy: 'día',
        rowsPerPage: 50,
      }"
    >
      <template #top="props">
        <div class="q-table__title">
          Pizzería
        </div>
        <q-space />
        <q-select
          v-model="columnasVisibles"
          class="col-2"
          label="Columnas"
          :options="columnas"
          :option-disable="({ required }) => required"
          :display-value="columnasVisibles.length"
          option-value="name"
          borderless
          multiple
          dense
          options-dense
          emit-value
          map-options
        >
          <template #prepend>
            <q-icon name="fas fa-columns" class="text-primary" left />
          </template>
        </q-select>
        <q-btn
          class="q-ml-md text-primary"
          flat round dense
          :icon="props.inFullscreen ? 'fas fa-compress' : 'fas fa-expand'"
          @click="props.toggleFullscreen"
        />
      </template>

      <template #loading>
        <q-inner-loading showing color="primary" />
      </template>

      <template #no-data>
        <div class="row flex-center full-width" style="height: 3rem">
          <q-icon size="2em" name="fas fa-kiwi-bird" />
        </div>
      </template>
    </q-table>
  </q-page>
</template>

<style lang="scss" scoped>
  .q-card .q-card__section .q-icon {
    font-size: 1.25rem;
  }

  /deep/ .q-table {
    thead tr:first-child th:first-child,
    thead tr:first-child th:nth-child(2) {
      color: white;
      background-color: $primary;
    }

    td:first-child,
    td:nth-child(2) {
      background-color: #f5f5f5;
    }

    th:first-child,
    td:first-child,
    th:nth-child(2),
    td:nth-child(2) {
      position: sticky;
      left: 0;
      min-width: 3.5rem;
      z-index: 1;
    }
  }
</style>

<script lang="ts">
  import {
    defineComponent,
    reactive,
    toRefs,
    PropType,
  } from '@vue/composition-api';

  import * as v from 'helpers/validation';

  import { IParameters } from 'components/Parameters.vue';

  export interface IVectorEstado {
    id: number, // @todo don't store, calculate row-key based on source, time and event
    reloj: number,
    evento: string,
    numeroPedido: number,
    proximoPedido: number,
    pedido: {
      tipoProducto: string
      cantidadPedida: number
      tiempoEntrePedidos: number
      llegadaProximoPedido: number
    }
    colaPedidosAPreparar: number,
    stockMiga: number,
    stockPizza: number,
    stockHamburguesa: number,
    stockLomito: number,
    stockEmpanadas: number,
    servidorEmpleado1: {
      estado: string
      numeroPedido: number
      tiempoPreparacion: number
      proximoFinAtencion: number
    }
    servidorEmpleado2: {
      estado: string
      numeroPedido: number
      tiempoPreparacion: number
      proximoFinAtencion: number
    }
    servidorEmpleado3: {
      estado: string
      numeroPedido: number
      tiempoPreparacion: number
      proximoFinAtencion: number
    }
    colaPedidosAEntregar: number,
    servidorDelivery: {
      estado: string
      pedidosAEntregar: number[]
      tiempoEntrega: number
      proximoFinEntrega: number
    }
  }

  export type TReplica = IVectorEstado[];

  // @todo move to format helper
  const nn = (value: number) => Number(
    value.toFixed(0),
  );

  const n3 = (value: number) => Number(
    value.toFixed(3),
  );

  const np = (value: number) => (
    (value % 1) ? `${Math.floor(value)}+` : value
  );

  const $ = (value: number) => (
    `$ ${value.toFixed(0)}`
  );

  const percent = (value: number) => `${
    Number(
      (value * 100).toFixed(0),
    )
  } %`;
  function useSimulation(props: { parameters: IParameters }) {
    const state = reactive({
      iteraciones: 100000,
      condicionMuestreo: '!(n % 10000)',
      columnas: [
        {
          name: 'evento',
          label: 'Evento',
          field: (row: IVectorEstado) => row.evento,
          align: 'right',
          required: true,
        },
        {
          name: 'reloj',
          label: 'Reloj',
          field: (row: IVectorEstado) => row.reloj,
          align: 'right',
          required: true,
        },
        {
          name: 'numero-pedido',
          label: 'N° Pedido',
          field: (row: IVectorEstado) => row.numeroPedido,
          format: nn,
          align: 'right',
        },
        {
          name: 'proximo-pedido',
          label: 'Próximo Pedido',
          field: (row: IVectorEstado) => row.proximoPedido,
          format: nn,
          align: 'right',
        },
        {
          name: 'tipo-producto',
          label: 'Tipo Producto',
          field: (row: IVectorEstado) => row.pedido.tipoProducto,
          format: nn,
          align: 'right',
        },
        {
          name: 'cantidad-pedida',
          label: 'Cantidad Pedida',
          field: (row: IVectorEstado) => row.pedido.cantidadPedida,
          format: nn,
          align: 'right',
        },
        {
          name: 'tiempo-entre-pedidos',
          label: 'Tiempo entre Pedidos',
          field: (row: IVectorEstado) => row.pedido.tiempoEntrePedidos,
          format: nn,
          align: 'right',
        },
        {
          name: 'llegada-proximo-pedido',
          label: 'Llegada Próximo Pedido',
          field: (row: IVectorEstado) => row.pedido.llegadaProximoPedido,
          format: nn,
          align: 'right',
        },
        {
          name: 'cola-pedidos-preparar',
          label: 'Cola Pedidos a Preparar',
          field: (row: IVectorEstado) => row.colaPedidosAPreparar,
          format: nn,
          align: 'right',
        },
        {
          name: 'stock-miga',
          label: 'Stock Miga',
          field: (row: IVectorEstado) => row.stockMiga,
          format: nn,
          align: 'right',
        },
        {
          name: 'stock-pizza',
          label: 'Stock Pizza',
          field: (row: IVectorEstado) => row.stockPizza,
          format: nn,
          align: 'right',
        },
        {
          name: 'stock-hamburguesa',
          label: 'Stock Hamburguesa',
          field: (row: IVectorEstado) => row.stockHamburguesa,
          format: nn,
          align: 'right',
        },
        {
          name: 'stock-lomito',
          label: 'Stock Lomito',
          field: (row: IVectorEstado) => row.stockLomito,
          format: nn,
          align: 'right',
        },
        {
          name: 'stock-empanadas',
          label: 'Stock Empanadas',
          field: (row: IVectorEstado) => row.stockEmpanadas,
          format: nn,
          align: 'right',
        },
        {
          name: 'srv1-estado',
          label: 'Empleado 1: Estado',
          field: (row: IVectorEstado) => row.servidorEmpleado1.estado,
          format: nn,
          align: 'right',
        },
        {
          name: 'srv1-numero-pedido',
          label: 'Empleado 1: N° Pedido',
          field: (row: IVectorEstado) => row.servidorEmpleado1.numeroPedido,
          format: nn,
          align: 'right',
        },
        {
          name: 'srv1-tiempo-preparacion',
          label: 'Empleado 1: Tiempo Preparación',
          field: (row: IVectorEstado) => row.servidorEmpleado1.tiempoPreparacion,
          format: nn,
          align: 'right',
        },
        {
          name: 'srv1-prox-fin-at',
          label: 'Empleado 1: Próximo Fin At.',
          field: (row: IVectorEstado) => row.servidorEmpleado1.proximoFinAtencion,
          format: nn,
          align: 'right',
        },
        {
          name: 'srv2-estado',
          label: 'Empleado 2: Estado',
          field: (row: IVectorEstado) => row.servidorEmpleado2.estado,
          format: nn,
          align: 'right',
        },
        {
          name: 'srv2-numero-pedido',
          label: 'Empleado 2: N° Pedido',
          field: (row: IVectorEstado) => row.servidorEmpleado2.numeroPedido,
          format: nn,
          align: 'right',
        },
        {
          name: 'srv2-tiempo-preparacion',
          label: 'Empleado 2: Tiempo Preparación',
          field: (row: IVectorEstado) => row.servidorEmpleado2.tiempoPreparacion,
          format: nn,
          align: 'right',
        },
        {
          name: 'srv2-prox-fin-at',
          label: 'Empleado 2: Próximo Fin At.',
          field: (row: IVectorEstado) => row.servidorEmpleado2.proximoFinAtencion,
          format: nn,
          align: 'right',
        },
        {
          name: 'srv3-estado',
          label: 'Empleado 3: Estado',
          field: (row: IVectorEstado) => row.servidorEmpleado3.estado,
          format: nn,
          align: 'right',
        },
        {
          name: 'srv3-numero-pedido',
          label: 'Empleado 3: N° Pedido',
          field: (row: IVectorEstado) => row.servidorEmpleado3.numeroPedido,
          format: nn,
          align: 'right',
        },
        {
          name: 'srv3-tiempo-preparacion',
          label: 'Empleado 3: Tiempo Preparación',
          field: (row: IVectorEstado) => row.servidorEmpleado3.tiempoPreparacion,
          format: nn,
          align: 'right',
        },
        {
          name: 'srv3-prox-fin-at',
          label: 'Empleado 3: Próximo Fin At.',
          field: (row: IVectorEstado) => row.servidorEmpleado3.proximoFinAtencion,
          format: nn,
          align: 'right',
        },
        {
          name: 'cola-pedidos-entregar',
          label: 'Cola Pedidos a Entregar',
          field: (row: IVectorEstado) => row.colaPedidosAEntregar,
          format: nn,
          align: 'right',
        },
        {
          name: 'srvDelivery-estado',
          label: 'Delivery: Estado',
          field: (row: IVectorEstado) => row.servidorDelivery.estado,
          format: nn,
          align: 'right',
        },
        {
          name: 'srvDelivery-pedidos-entregar',
          label: 'Delivery: Pedidos a Entregar',
          field: (row: IVectorEstado) => row.servidorDelivery.pedidosAEntregar,
          format: nn,
          align: 'right',
        },
        {
          name: 'srvDelivery-tiempo-entrega',
          label: 'Delivery: Tiempo Entrega',
          field: (row: IVectorEstado) => row.servidorDelivery.tiempoEntrega,
          format: nn,
          align: 'right',
        },
        {
          name: 'srvDelivery-prox-fin-en',
          label: 'Delivery: Próximo Fin Entrega',
          field: (row: IVectorEstado) => row.servidorDelivery.proximoFinEntrega,
          format: nn,
          align: 'right',
        },
      ],
      columnasVisibles: [
        'reloj', 'evento',
      ],

      replicas: [] as TReplica,
      vectores: [] as IVectorEstado[],

      loading: false,

      onSubmit: () => {
        // @todo call executor function with required parameters
      },
    });

    return toRefs(state);
  }

  export default defineComponent({
    name: 'Simulation',
    components: {},
    props: {
      parameters: {
        required: true,
        type: Object as PropType<IParameters>,
      },
    },
    setup(props) {
      return {
        v,
        ...useSimulation(props),
      };
    },
  });
</script>
