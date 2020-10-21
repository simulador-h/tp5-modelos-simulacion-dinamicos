<template>
  <q-page>
    <q-tabs
      v-model="activeTab"
      align="justify"
      active-color="primary"
      indicator-color="primary"
      class="text-grey"
    >
      <q-tab name="parameters" label="Parámetros" />
      <q-tab name="simulation" label="Simulación" />
      <q-tab name="results" label="Resultados" />
    </q-tabs>

    <q-tab-panels v-model="activeTab" animated keep-alive>
      <q-tab-panel name="parameters">
        <parameters :parameters="parameters" @submit="save" @reset="reload" />
      </q-tab-panel>
      <q-tab-panel name="simulation">
        <simulation :parameters="parameters" />
      </q-tab-panel>
      <q-tab-panel name="results">
        <results :results="results" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script lang="ts">
  import {
    defineComponent,
    reactive,
    toRefs,
  } from '@vue/composition-api';

  import _ from 'lodash-es';

  import { UniformDistribution } from 'models/UniformDistribution';
  import { NormalDistribution } from 'models/NormalDistribution';
  import { ExponentialDistribution } from 'models/ExponentialDistribution';
  import { PoissonDistribution } from 'models/PoissonDistribution';
  import { DiscreteDistribution } from 'models/DiscreteDistribution';

  import Parameters, { IParameters } from 'components/Parameters.vue';
  import Simulation from 'components/Simulation.vue';
  import Results, { IResults } from 'components/Results.vue';

  const defaultParameters: IParameters = {
    pedidos: {
      demanda: new PoissonDistribution({ rate: 5 / 60 }),
      tipo: new DiscreteDistribution({
        sandwiches: 0.2,
        pizzas: 0.4,
        empanadas: 0.3,
        hamburgesas: 0.05,
        lomitos: 0.05,
      }),
      sandwiches: {
        cantidadPedido: 1,
        precioVenta: 500,
        tiempoPreparacion: new NormalDistribution({ mean: 10, std: 5 }),
      },
      pizzas: {
        cantidadPedido: 1,
        precioVenta: 250,
        tiempoPreparacion: new UniformDistribution({ a: 15, b: 18 }),
      },
      empanadas: {
        cantidadPedido: new PoissonDistribution({ rate: 3 }),
        precioVenta: 25,
        capacidadMaximaFreidora: 3,
        tiempoPreparacionMedio: 2.5,
        tiempoPreparacionCompleto: 3.5,
      },
      hamburgesas: {
        cantidadPedido: 1,
        precioVenta: 400,
        tiempoPreparacion: 8,
      },
      lomitos: {
        cantidadPedido: 1,
        precioVenta: 450,
        tiempoPreparacion: 8,
      },
    },
    envios: {
      tiempoEnvio: new ExponentialDistribution({ rate: 1 / 3 }),
      cantidadMaximaPorEnvio: 3,
    },
    entregas: {
      tiempoLimiteCobro: 25,
      tiempoLimiteEspera: 60,
    },
    turnos: {
      duracionTurno: 6 * 60,
    },
  };

  function useMontecarlo() {
    const state = reactive({
      activeTab: 'parameters',
      parameters: _.cloneDeep(defaultParameters),
      results: {
        tiempoEntrePedidos: {
          promedio: 20,
          desviacion: 40,
        },
      }, // @todo condition initial render or show empty results screen

      save: (parameters: IParameters) => {
        state.parameters = _.cloneDeep(parameters);
      },
      reload: () => {
        state.parameters = _.cloneDeep(defaultParameters);
      },
      finish: (results: IResults) => {
        state.results = results; // @todo check reactivity
      },
    });

    return toRefs(state);
  }

  export default defineComponent({
    name: 'Montecarlo',
    components: { Parameters, Simulation, Results },
    setup() {
      return useMontecarlo();
    },
  });
</script>
