<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-6 col-lg-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center justify-between">
            <q-icon name="fas fa-clock" class="text-primary" />
            <span class="text-uppercase text-caption text-primary">
              Tiempo promedio libre de los empleados de cocción
            </span>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-6 col-lg-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center justify-between">
            <q-icon name="fas fa-clock" class="text-primary" />
            <span class="text-uppercase text-caption text-primary">
              Tiempo promedio libre de los empleados de delivery
            </span>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-6 col-lg-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center justify-between">
            <q-icon name="fas fa-dollar-sign" class="text-primary" />
            <span class="text-uppercase text-caption text-primary">
              Ventas perdidas en promedio por día
            </span>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-6 col-lg-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center justify-between">
            <q-icon name="fas fa-dollar-sign" class="text-primary" />
            <span class="text-uppercase text-caption text-primary">
              Valor de las ventas pedidas
            </span>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-6 col-lg-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center justify-between">
            <q-icon name="fas fa-dollar-sign" class="text-primary" />
            <span class="text-uppercase text-caption text-primary">
              Número máximo de ventas perdidas
            </span>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-6 col-lg-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center justify-between">
            <q-icon name="fas fa-dollar-sign" class="text-primary" />
            <span class="text-uppercase text-caption text-primary">
              Ventas con entrega gratuita por día
            </span>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-6 col-lg-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center justify-between">
            <q-icon name="fas fa-dollar-sign" class="text-primary" />
            <span class="text-uppercase text-caption text-primary">
              Valor de los ingresos
            </span>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-6 col-lg-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center justify-between">
            <q-icon name="fas fa-dollar-sign" class="text-primary" />
            <span class="text-uppercase text-caption text-primary">
              Ingreso promedio diarios y desvió
            </span>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-6 col-lg-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center justify-between">
            <q-icon name="fas fa-clock" class="text-primary" />
            <span class="text-uppercase text-caption text-primary">
              Tiempo promedio de espera para comenzar a ser procesado cada pedido
            </span>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-6 col-lg-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center justify-between">
            <q-icon name="fas fa-clock" class="text-primary" />
            <span class="text-uppercase text-caption text-primary">
              Tiempo promedio de entrega del pedido  desde que el cliente hizo el pedido
            </span>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-6 col-lg-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center justify-between">
            <q-icon name="fas fa-clock" class="text-primary" />
            <span class="text-uppercase text-caption text-primary">
              Tiempo promedio de entrega del pedido  desde que el cliente hizo el pedido
            </span>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-6 col-lg-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center justify-between">
            <q-icon name="fas fa-chart-bar" class="text-primary" />
            <span class="text-uppercase text-caption text-primary">
              ¿Cuál es la probabilidad de obtener $250 o menos en cada pedido entregados?
            </span>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-6 col-lg-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center justify-between">
            <q-icon name="fas fa-chart-bar" class="text-primary" />
            <span class="text-uppercase text-caption text-primary">
              ¿Cuál es la probabilidad de que abandonen o sean gratis 5 o más pedidos por día?
            </span>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>

</style>

<script lang="ts">
  import {
    defineComponent,
    PropType,
  } from '@vue/composition-api';

  export interface IResults {
    tiempoPromLibreCocina: number,
    tiempoPromLibreDelivery: number,
    ventasPerdidasProm: number,
    ventasConEntregaGratis: number,
    ingresos: number,
    ingresosHamburguesasYLomitos: number,
    ingresosPizza: number,
    ingresosEmpanadas: number,
    ingresosMiga: number,
    ventasPerdidas: number,
    ingresosProm: {
      promedio: number
      desviacion: number
    },
    maxVentasPerdidas: number,
    tiempoPromEsperaProceso: number,
    tiempoPromEntregaPedido: number,
    probMenorIgual250: number,
    probAbandonoGratis5: number,
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
