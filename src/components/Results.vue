<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-6 col-lg-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center justify-between">
            <q-icon name="fas fa-clock" class="text-primary" />
            <span class="text-uppercase text-caption text-primary">
              Tiempo entre pedido
            </span>
            <span class="text-uppercase text-caption text-primary">
              {{ results.tiempoEntrePedido ?
                results.tiempoEntrePedido.promedio +" +- "+ results.tiempoEntrePedido.desviacion
                : "-" }}
            </span>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-6 col-lg-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center justify-between">
            <q-icon name="fas fa-boxes" class="text-primary" />
            <span class="text-uppercase text-caption text-primary">
              Cantidad de pedidos en cada hora
            </span>
            <span class="text-uppercase text-caption text-primary">
              {{ results.cantidadPedidosXhora ?
                results.cantidadPedidosXhora.promedio +" +- "+ results.cantidadPedidosXhora.desviacion
                : "-" }}
            </span>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-6 col-lg-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center justify-between">
            <q-icon name="fas fa-boxes" class="text-primary" />
            <span class="text-uppercase text-caption text-primary">
              Tipo de producto pedido
            </span>
            <span class="text-uppercase text-caption text-primary">
              {{ results.tipoProductoPedido ?
                results.tipoProductoPedido.promedio +" +- "+ results.tipoProductoPedido.desviacion
                : "-" }}
            </span>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-6 col-lg-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center justify-between">
            <q-icon name="fas fa-clock" class="text-primary" />
            <span class="text-uppercase text-caption text-primary">
              Tiempo de preparación de sándwich
            </span>
            <span class="text-uppercase text-caption text-primary">
              {{ results.tiempoPrepaSandwich ?
                results.tiempoPrepaSandwich.promedio +" +- "+ results.tiempoPrepaSandwich.desviacion
                : "-" }}
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
              Tiempo de cocción de pizzas
            </span>
            <span class="text-uppercase text-caption text-primary">
              {{ results.tiempoCoccPizza ?
                results.tiempoCoccPizza.promedio +" +- "+ results.tiempoCoccPizza.desviacion
                : "-" }}
            </span>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-6 col-lg-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center justify-between">
            <q-icon name="fas fa-brain" class="text-primary" />
            <span class="text-uppercase text-caption text-primary">
              Cantidad de empanadas demandas
            </span>
            <span class="text-uppercase text-caption text-primary">
              {{ results.cantidadEmpanadas ?
                results.cantidadEmpanadas.promedio +" +- "+ results.cantidadEmpanadas.desviacion
                : "-" }}
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
              Tiempo de cocción de empanadas
            </span>
            <span class="text-uppercase text-caption text-primary">
              {{ results.tiempoCoccEmpanadas ?
                results.tiempoCoccEmpanadas.promedio +" +- "+ results.tiempoCoccEmpanadas.desviacion
                : "-" }}
            </span>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-6 col-lg-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center justify-between">
            <q-icon name="fas fa-hamburger" class="text-primary" />
            <span class="text-uppercase text-caption text-primary">
              Ingreso por hamburguesas y lomitos
            </span>
            <span class="text-uppercase text-caption text-primary">
              {{ results.ingresoLomitoHamb ?
                results.ingresoLomitoHamb.promedio +" +- "+ results.ingresoLomitoHamb.desviacion
                : "-" }}
            </span>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-6 col-lg-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center justify-between">
            <q-icon name="fas fa-hat-chef" class="text-primary" />
            <span class="text-uppercase text-caption text-primary">
              Orden en el uso de los empleados de cocción
            </span>
            <span class="text-uppercase text-caption text-primary">
              {{ results.ordenCocineros ?
                results.ordenCocineros.promedio +" +- "+ results.ordenCocineros.desviacion
                : "-" }}
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
              Tiempo promedio libre de los empleados de cocción
            </span>
            <span class="text-uppercase text-caption text-primary">
              {{ results.tiempoPromLibreCocina ? results.tiempoPromLibreCocina : "-" }}
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
            <span class="text-uppercase text-caption text-primary">
              {{ results.tiempoPromLibreDelivery ? results.tiempoPromLibreDelivery : "-" }}
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
            <span class="text-uppercase text-caption text-primary">
              {{ results.tiempoPromEsperaProceso ? results.tiempoPromEsperaProceso : "-" }}
            </span>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-6 col-lg-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center justify-between">
            <q-icon name="fas fa-clock" class="text-primary" />
            <span class="text-uppercase text-caption text-primary">
              Tiempo promedio de entrega del pedido desde que el cliente hizo el pedido
            </span>
            <span class="text-uppercase text-caption text-primary">
              {{ results.tiempoPromEntregaPedido ? results.tiempoPromEntregaPedido : "-" }}
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
            <span class="text-uppercase text-caption text-primary">
              {{ results.ventasPerdidasProm ? results.ventasPerdidasProm : "-" }}
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
            <span class="text-uppercase text-caption text-primary">
              {{ results.valorVentasPerdidas ? results.valorVentasPerdidas : "-" }}
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
            <span class="text-uppercase text-caption text-primary">
              {{ results.maxVentasPerdidas ? results.maxVentasPerdidas : "-" }}
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
            <span class="text-uppercase text-caption text-primary">
              {{ results.ventasConEntregaGratis ? results.ventasConEntregaGratis : "-" }}
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
            <span class="text-uppercase text-caption text-primary">
              {{ results.ingresos ? results.ingresos : "-" }}
            </span>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-6 col-lg-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center justify-between">
            <q-icon name="fas fa-dollar-sign" class="text-primary" />
            <span class="text-uppercase text-caption text-primary">
              Ingreso promedio diarios y desvío
            </span>
            <span class="text-uppercase text-caption text-primary">
              {{ results.ingresosProm ? results.ingresosProm : "-" }}
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
            <span class="text-uppercase text-caption text-primary">
              {{ results.probMenorIgual250 ? results.probMenorIgual250 : "-" }}
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
            <span class="text-uppercase text-caption text-primary">
              {{ results.probAbandonoGratis5 ? results.probAbandonoGratis5 : "-" }}
            </span>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
  .q-card .q-card__section .q-icon {
    font-size: 1.25rem;
  }
</style>

<script lang="ts">
  import {
    defineComponent,
    PropType,
  } from '@vue/composition-api';

  export interface IResults {
    tiempoEntrePedido: {
      promedio: number
      desviacion: number
    },
    cantidadPedidosXhora: {
      promedio: number
      desviacion: number
    },
    tipoProductoPedido: {
      promedio: number
      desviacion: number
    },
    tiempoPrepaSandwich: {
      promedio: number
      desviacion: number
    },
    tiempoCoccPizza: {
      promedio: number
      desviacion: number
    },
    cantidadEmpanadas: {
      promedio: number
      desviacion: number
    },
    tiempoCoccEmpanadas: {
      promedio: number
      desviacion: number
    },
    ingresoLomitoHamb: {
      promedio: number
      desviacion: number
    },
    ordenCocineros: {
      promedio: number
      desviacion: number
    },
    tiempoPromLibreCocina: number,
    tiempoPromLibreDelivery: number,
    ventasPerdidasProm: number,
    ventasConEntregaGratis: number,
    ingresos: number,
    ingresosHamburguesasYLomitos: number,
    ingresosPizza: number,
    ingresosEmpanadas: number,
    ingresosMiga: number,
    valorVentasPerdidas: number,
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
