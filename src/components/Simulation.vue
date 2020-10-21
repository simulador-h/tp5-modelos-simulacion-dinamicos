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
      :data="replica"
      :loading="loading"
      :pagination="{
        sortBy: 'id',
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
  /* eslint-disable max-classes-per-file */

  import {
    defineComponent,
    reactive,
    toRefs,
    PropType,
  } from '@vue/composition-api';

  import _ from 'lodash-es';

  import * as v from 'helpers/validation';

  import { IParameters } from 'components/Parameters.vue';

  enum Evento {
    InicioSimulacion = 'Inicio Simulación',
    FinSimulacion = 'Fin Simulación',

    InicioTurno = 'Inicio Turno',
    FinTurno = 'Fin Turno',

    LlegadaPedido = 'Llegada Pedido',
    AbandonoPedido = 'Abandono Pedido',
    FinPreparacionPedido = 'Fin Preparación Pedido',
    FinEntregaPedido = 'Fin Entrega Pedido',
  }

  class Sistema {
    tipo = 'Sistema';

    getNombre() {
      return `${_.startCase(this.tipo)}`;
    }
  }

  enum TipoTurno {
    Mañana = 'Mañana',
    Noche = 'Noche',
  }

  class Turno extends Sistema {
    readonly tipo: TipoTurno;
    readonly inicioTurno: number;
    readonly finTurno: number;
    sobretiempo?: number;

    constructor(tipo: TipoTurno, inicioTurno: number, finTurno: number) {
      super();
      this.tipo = tipo;
      this.inicioTurno = inicioTurno;
      this.finTurno = finTurno;
    }

    getNombre() {
      return `Turno (${_.startCase(this.tipo)})`;
    }

    getSobretiempo(reloj: number) {
      return this.sobretiempo ?? _.clamp(reloj - this.finTurno, 0, Infinity);
    }

    finalizarTurno(reloj: number) {
      this.sobretiempo = this.getSobretiempo(reloj);
    }
  }

  class Cliente {
    readonly id: number;

    constructor(id: number) {
      this.id = id;
    }
  }

  enum EstadoPedido {
    EsperandoPreparacion = 'Esperando Preparación',
    SiendoPreparado = 'Siendo Preparado',
    EsperandoEntrega = 'Esperando Entrega',
    SiendoEntregado = 'Siendo Entregado',

    Almacenado = 'Almacenado',
    Abandonado = 'Abandonado',
    Entregado = 'Entregado',
  }

  enum TipoPedido {
    Sandwiches = 'Sandwiches',
    Pizzas = 'Pizzas',
    Empanadas = 'Empanadas',
    Hamburgesas = 'Hamburgesas',
    Lomitos = 'Lomitos',
  }

  class Pedido extends Cliente {
    readonly tipo: TipoPedido;
    readonly cantidad: number;
    readonly precioVenta: number;
    readonly tiempoLlegada: number;
    readonly tiempoAbandono: number;
    readonly tiempoCobro: number;

    estado: EstadoPedido;

    inicioPreparacion?: number;
    tiempoPreparacion?: number;
    finPreparacion?: number;

    inicioEntrega?: number;
    tiempoEntrega?: number;
    finEntrega?: number;

    constructor(
      id: number, tipo: TipoPedido, cantidad: number, precioVenta: number,
      tiempoLlegada: number, tiempoAbandono: number, tiempoCobro: number,
    ) {
      super(id);
      this.tipo = tipo;
      this.cantidad = cantidad;
      this.precioVenta = precioVenta;
      this.tiempoLlegada = tiempoLlegada;
      this.tiempoAbandono = tiempoLlegada + tiempoAbandono;
      this.tiempoCobro = tiempoLlegada + tiempoCobro;

      this.estado = EstadoPedido.EsperandoPreparacion;
    }

    getNombre() {
      return `${_.startCase(this.tipo)} (${this.id})`;
    }

    iniciarPreparacion(reloj: number, tiempoPreparacion: number) {
      this.estado = EstadoPedido.SiendoPreparado;
      this.inicioPreparacion = reloj;
      this.tiempoPreparacion = tiempoPreparacion;
      this.finPreparacion = reloj + tiempoPreparacion;
    }

    finalizarPreparacion(reloj: number) {
      this.estado = (reloj >= this.tiempoAbandono) ? EstadoPedido.Almacenado : EstadoPedido.EsperandoEntrega;
    }

    iniciarEntrega(reloj: number, tiempoEntrega: number) {
      this.estado = EstadoPedido.SiendoEntregado;
      this.inicioEntrega = reloj;
      this.tiempoEntrega = tiempoEntrega;
      this.finEntrega = reloj + tiempoEntrega;
    }

    finalizarEntrega(reloj: number) {
      this.estado = (reloj >= this.tiempoAbandono) ? EstadoPedido.Almacenado : EstadoPedido.Entregado;
    }

    abandonar() {
      if (this.estado === EstadoPedido.EsperandoPreparacion) {
        this.estado = EstadoPedido.Abandonado;
      }
      else if (this.estado === EstadoPedido.EsperandoEntrega) {
        this.estado = EstadoPedido.Almacenado;
      }
    }
  }

  class ColleccionPedidos extends Array<Pedido> {
    getEsperandoPreparacion = () => this.filter(({ estado }) => estado === EstadoPedido.EsperandoPreparacion);
    getEsperandoEntrega = () => this.filter(({ estado }) => estado === EstadoPedido.EsperandoEntrega);
    getAlmacenado = () => this.filter(({ estado }) => estado === EstadoPedido.Almacenado);
    getAbandonado = () => this.filter(({ estado }) => estado === EstadoPedido.Abandonado);
    getEntregado = () => this.filter(({ estado }) => estado === EstadoPedido.Entregado);

    // @todo calculate on push for perfomance
    getProximoId = () => (_.maxBy(this, 'id')?.id || 0) + 1;

    // @todo calculate on push for perfomance
    getProximoAbandonoPedido = (reloj: number) => _.minBy(
      this.filter(
        ({ estado, tiempoAbandono }) => ((
          estado === EstadoPedido.EsperandoPreparacion || estado === EstadoPedido.EsperandoEntrega
        ) && (
          tiempoAbandono >= reloj
        )),
      ),
      'tiempoAbandono',
    );
  }

  enum EstadoEmpleado {
    Libre = 'Libre',
    Ocupado = 'Ocupado',
    NoDisponible = 'No Disponible',
  }

  class Servidor {
    id: number;

    constructor(id: number) {
      this.id = id;
    }
  }

  enum TipoEmpleado {
    Cocinero = 'Cocinero',
    Repartidor = 'Repartidor',
  }

  class Empleado extends Servidor {
    tipo: TipoEmpleado;
    estado: EstadoEmpleado;

    tiempoLibre: number;
    inicioTiempoLibre?: number;

    pedidoPreparacion?: Pedido;
    inicioPreparacionPedido?: number;
    finPreparacionPedido?: number;

    pedidosEntrega?: Pedido[];
    inicioEntregaPedidos?: number;
    finEntregaPedidos?: number;

    constructor(id: number, tipo: TipoEmpleado) {
      super(id);
      this.tipo = tipo;
      this.estado = EstadoEmpleado.Libre;
      this.tiempoLibre = 0;
      this.inicioTiempoLibre = 0;
    }

    getNombre() {
      return `${_.startCase(this.tipo)} (${this.id})`;
    }

    iniciarPreparacion(reloj: number, tiempoPreparacion: number, pedido: Pedido) {
      if (this.estado === EstadoEmpleado.Libre && this.inicioTiempoLibre !== undefined) {
        this.tiempoLibre += reloj - this.inicioTiempoLibre;
        this.inicioTiempoLibre = undefined;
      }

      this.estado = EstadoEmpleado.Ocupado;
      this.pedidoPreparacion = pedido;
      this.inicioPreparacionPedido = reloj;
      this.finPreparacionPedido = reloj + tiempoPreparacion;
      pedido.iniciarPreparacion(reloj, tiempoPreparacion);
    }

    finalizarPreparacion(reloj: number, tiempoPreparacion?: number, pedido?: Pedido) {
      this.pedidoPreparacion?.finalizarPreparacion(reloj);

      if (tiempoPreparacion && pedido) {
        this.iniciarPreparacion(reloj, tiempoPreparacion, pedido);
      }
      else {
        this.estado = EstadoEmpleado.Libre;
        this.inicioTiempoLibre = reloj;
        this.pedidoPreparacion = undefined;
        this.inicioPreparacionPedido = undefined;
        this.finPreparacionPedido = undefined;
      }
    }

    iniciarEntrega(reloj: number, tiempoEntrega: number, pedidos: Pedido[]) {
      this.estado = EstadoEmpleado.Ocupado;
      this.pedidosEntrega = pedidos;
      this.inicioEntregaPedidos = reloj;
      this.finEntregaPedidos = reloj + tiempoEntrega;

      // eslint-disable-next-line no-restricted-syntax
      for (const pedido of pedidos) {
        pedido.iniciarEntrega(reloj, tiempoEntrega);
      }
    }

    finalizarEntrega(reloj: number, tiempoEntrega?: number, pedidos?: Pedido[]) {
      if (this.pedidosEntrega) {
        // eslint-disable-next-line no-restricted-syntax
        for (const pedido of this.pedidosEntrega) {
          pedido.finalizarEntrega(reloj);
        }
      }

      if (tiempoEntrega && pedidos?.length) {
        this.iniciarEntrega(reloj, tiempoEntrega, pedidos);
      }
      else {
        this.estado = EstadoEmpleado.Libre;
        this.pedidosEntrega = undefined;
        this.inicioEntregaPedidos = undefined;
        this.finEntregaPedidos = undefined;
      }
    }
  }

  class ColleccionEmpleados extends Array<Empleado> {
    getLibres = () => this.filter(({ estado }) => estado === EstadoEmpleado.Libre);

    getCocinerosLibres = () => this.filter(({ tipo, estado }) => (
      tipo === TipoEmpleado.Cocinero && estado === EstadoEmpleado.Libre
    ));

    getRepartidoresLibres = () => this.filter(({ tipo, estado }) => (
      tipo === TipoEmpleado.Repartidor && estado === EstadoEmpleado.Libre
    ));

    getOcupados = () => this.filter(({ estado }) => estado === EstadoEmpleado.Ocupado);
    getNoDisponibles = () => this.filter(({ estado }) => estado === EstadoEmpleado.NoDisponible);

    // @todo calculate on push for perfomance
    getProximoFinPreparacionPedido = () => _.minBy(
      this.filter(
        ({ tipo, estado }) => (tipo === TipoEmpleado.Cocinero && estado === EstadoEmpleado.Ocupado),
      ),
      'finPreparacionPedido',
    );

    // @todo calculate on push for perfomance
    getProximoFinEntregaPedido = () => _.minBy(
      this.filter(
        ({ tipo, estado }) => (tipo === TipoEmpleado.Repartidor && estado === EstadoEmpleado.Ocupado),
      ),
      'finEntregaPedidos',
    );
  }

  export interface IVectorEstado {
    id: number
    reloj: number
    evento: Evento
    emisor: Sistema | Turno | Pedido | Empleado

    // @todo make required
    turno: Turno | null,
    pedidos: ColleccionPedidos | null,
    empleados: ColleccionEmpleados | null,
    // almacen: Pedido[] | null,

    llegadaPedido?: {
      tiempoEntreLlegadas: number
      proximaLlegada: number
    }

    // colaPreparacion: Pedido[] | null
    // colaEnvio: Pedido[] | null
  }

  export type TReplica = IVectorEstado[];

  type TSamplingFilter = (n: number) => boolean

  interface IConfiguration {
    runs: number
    filter: TSamplingFilter
  }

  let sistema: Sistema;

  function generarInicioSimulacion(parametros: IParameters): IVectorEstado {
    sistema = new Sistema();

    return {
      id: 0,
      reloj: 0,
      evento: Evento.InicioSimulacion,
      emisor: sistema,

      turno: null,
      pedidos: null,
      empleados: null,
      // almacen: null,
      // colaPreparacion: null,
      // colaEnvio: null,
    };
  }

  function generarFinSimulacion(estado: IVectorEstado, parametros: IParameters): IVectorEstado {
    const {
      id, reloj, evento, emisor, ...estadoHeredado
    } = estado;

    return {
      id: id + 1,
      reloj,
      evento: Evento.FinSimulacion,
      emisor: sistema,

      ...estadoHeredado,
    };
  }

  function generarInicioTurno(estado: IVectorEstado, parametros: IParameters): IVectorEstado {
    const {
      pedidos: { demanda },
      turnos: { duracionTurno },
    } = parametros;

    const {
      id, evento,
    } = estado;

    const tipoTurno = (evento === Evento.InicioSimulacion) ? TipoTurno.Mañana : TipoTurno.Noche;
    const turno = new Turno(tipoTurno, 0, duracionTurno);

    const vector: IVectorEstado = {
      id: id + 1,
      reloj: 0,
      evento: Evento.InicioTurno,
      emisor: turno,
      turno,

      pedidos: new ColleccionPedidos(),
      empleados: new ColleccionEmpleados(
        new Empleado(1, TipoEmpleado.Cocinero),
        new Empleado(2, TipoEmpleado.Cocinero),
        new Empleado(3, TipoEmpleado.Cocinero),
        new Empleado(4, TipoEmpleado.Repartidor),
      ),
      // almacen: [],
      // colaPreparacion: [],
      // colaEnvio: [],
    };

    const tiempoEntreLlegadas = demanda.sample();

    if (tiempoEntreLlegadas < turno.finTurno) {
      vector.llegadaPedido = {
        tiempoEntreLlegadas,
        proximaLlegada: tiempoEntreLlegadas,
      };
    }

    return vector;
  }

  function generarFinTurno(estado: IVectorEstado, parametros: IParameters): IVectorEstado {
    const {
      id, reloj, evento, emisor, ...estadoHeredado
    } = estado;

    return {
      id: id + 1,
      reloj,
      evento: Evento.FinTurno,
      emisor: estadoHeredado.turno as Turno,

      ...estadoHeredado,
    };
  }

  function generarLlegadaPedido(estado: IVectorEstado, parametros: IParameters) {
    const {
      pedidos: { demanda, tipo, ...parametrosPedidos },
      entregas: { tiempoLimiteEspera, tiempoLimiteCobro },
    } = parametros;

    const {
      id, reloj, evento, emisor, ...estadoHeredado
    } = estado;

    const vector: IVectorEstado = {
      id: id + 1,
      reloj: estado.llegadaPedido?.proximaLlegada as number,
      evento: Evento.LlegadaPedido,
      emisor: sistema,

      ...estadoHeredado,
    };

    const tiempoEntreLlegadas = _.clamp(
      demanda.sample(), 0, Infinity,
    );
    const finTurno = estado.turno?.finTurno as number;

    if (tiempoEntreLlegadas < finTurno) {
      vector.llegadaPedido = {
        tiempoEntreLlegadas,
        proximaLlegada: vector.reloj + tiempoEntreLlegadas,
      };
    }

    const idPedido = vector.pedidos?.getProximoId();
    // eslint-disable-next-line no-underscore-dangle
    const _tipoPedido = tipo.sample() as unknown as string;
    let pedido: Pedido;

    const tiempoLlegada = vector.reloj;

    if (_tipoPedido === 'sandwiches') {
      const tipoPedido = TipoPedido.Sandwiches;
      const parametrosPedido = parametrosPedidos.sandwiches;

      const cantidad = parametrosPedido.cantidadPedido as number;
      const precioVenta = cantidad * parametrosPedido.precioVenta;

      pedido = new Pedido(idPedido, tipoPedido, cantidad, precioVenta, tiempoLlegada, tiempoLimiteEspera, tiempoLimiteCobro);
    }
    else if (_tipoPedido === 'pizzas') {
      const tipoPedido = TipoPedido.Pizzas;
      const parametrosPedido = parametrosPedidos.pizzas;

      const cantidad = parametrosPedido.cantidadPedido as number;
      const precioVenta = cantidad * parametrosPedido.precioVenta;

      pedido = new Pedido(idPedido, tipoPedido, cantidad, precioVenta, tiempoLlegada, tiempoLimiteEspera, tiempoLimiteCobro);
    }
    else if (_tipoPedido === 'empanadas') {
      const tipoPedido = TipoPedido.Empanadas;
      const parametrosPedido = parametrosPedidos.empanadas;

      const cantidad = (parametrosPedido.cantidadPedido as any).sample() as number;
      const precioVenta = cantidad * parametrosPedido.precioVenta;

      pedido = new Pedido(idPedido, tipoPedido, cantidad, precioVenta, tiempoLlegada, tiempoLimiteEspera, tiempoLimiteCobro);
    }
    else if (_tipoPedido === 'hamburgesas') {
      const tipoPedido = TipoPedido.Hamburgesas;
      const parametrosPedido = parametrosPedidos.hamburgesas;
      const cantidad = parametrosPedido.cantidadPedido as number;
      const precioVenta = cantidad * parametrosPedido.precioVenta;

      pedido = new Pedido(idPedido, tipoPedido, cantidad, precioVenta, tiempoLlegada, tiempoLimiteEspera, tiempoLimiteCobro);
    }
    else {
      const tipoPedido = TipoPedido.Lomitos;
      const parametrosPedido = parametrosPedidos.lomitos;
      const cantidad = parametrosPedido.cantidadPedido as number;
      const precioVenta = cantidad * parametrosPedido.precioVenta;

      pedido = new Pedido(idPedido, tipoPedido, cantidad, precioVenta, tiempoLlegada, tiempoLimiteEspera, tiempoLimiteCobro);
    }

    vector.pedidos?.push(pedido);

    const cocinerosLibres = vector.empleados?.getCocinerosLibres() as Empleado[];

    if (cocinerosLibres.length) {
      // @todo [Math.floor(Math.random() * length))]
      const empleado = _.maxBy(cocinerosLibres, 'tiempoLibre') as Empleado;
      let tiempoPreparacion;

      if (pedido.tipo === TipoPedido.Sandwiches) {
        const parametrosPedido = parametrosPedidos.sandwiches;
        tiempoPreparacion = (parametrosPedido.tiempoPreparacion as any).sample() as number;
      }
      else if (pedido.tipo === TipoPedido.Pizzas) {
        const parametrosPedido = parametrosPedidos.pizzas;
        tiempoPreparacion = (parametrosPedido.tiempoPreparacion as any).sample() as number;
      }
      else if (pedido.tipo === TipoPedido.Empanadas) {
        const { capacidadMaximaFreidora, tiempoPreparacionMedio, tiempoPreparacionCompleto } = parametrosPedidos.empanadas;
        tiempoPreparacion = (pedido.cantidad >= capacidadMaximaFreidora)
          ? (
            tiempoPreparacionCompleto * Math.floor(pedido.cantidad / capacidadMaximaFreidora)
            + tiempoPreparacionMedio * (pedido.cantidad % capacidadMaximaFreidora)
          )
          : tiempoPreparacionMedio;
      }
      else if (pedido.tipo === TipoPedido.Hamburgesas) {
        const parametrosPedido = parametrosPedidos.hamburgesas;
        tiempoPreparacion = parametrosPedido.tiempoPreparacion as number;
      }
      else {
        const parametrosPedido = parametrosPedidos.lomitos;
        tiempoPreparacion = parametrosPedido.tiempoPreparacion as number;
      }

      empleado.iniciarPreparacion(tiempoLlegada, tiempoPreparacion, pedido);
    }

    return vector;
  }

  function generarFinPreparacionPedido(estado: IVectorEstado, parametros: IParameters) {
    tiempoPrep
  }

  function generarFinEntregaPedido(estado: IVectorEstado, parametros: IParameters) {
    // tiempoEntr === 0
  }

  function generarAbandonoPedido(estado: IVectorEstado, parametros: IParameters) {
    // tiempoEntr === 0
  }

  function executeNext(estado: IVectorEstado, parametros: IParameters): IVectorEstado | undefined {
    if (estado.evento === Evento.InicioSimulacion) {
      return generarInicioTurno(estado, parametros);
    }

    if (estado.evento === Evento.FinTurno) {
      if (estado.turno?.tipo === TipoTurno.Mañana) {
        return generarInicioTurno(estado, parametros);
      }

      return generarFinSimulacion(estado, parametros);
    }

    // eslint-disable-next-line max-len
    if (!estado.turno || !estado.pedidos || !estado.empleados /* || !estado.almacen || !estado.colaPreparacion || !estado.colaEnvio */) {
      throw new Error('Unreachable condition');
    }

    if (
      // estado.reloj >= estado.turno.finTurno &&
      estado.empleados.getLibres.length === 0
      && estado.empleados.getOcupados.length === 0
    ) {
      return generarFinTurno(estado, parametros);
    }

    const proximaLlegadaPedido = estado.llegadaPedido?.proximaLlegada;
    const proximoFinPreparacionPedido = estado.empleados?.getProximoFinPreparacionPedido()?.finPreparacionPedido;
    const proximoFinEntregaPedido = estado.empleados?.getProximoFinEntregaPedido()?.finEntregaPedidos;
    const proximoAbandonoPedido = estado.pedidos?.getProximoAbandonoPedido(estado.reloj);

    const tiempoProximoEvento = _.min([
      proximaLlegadaPedido,
      proximoFinPreparacionPedido,
      proximoFinEntregaPedido,
      proximoAbandonoPedido,
    ]);

    if (tiempoProximoEvento === proximoAbandonoPedido) {
      return generarAbandonoPedido();
    }
    else if (tiempoProximoEvento === proximoFinEntregaPedido) {
      return generarFinEntregaPedido();
    }
    else if (tiempoProximoEvento === proximoFinPreparacionPedido) {
      return generarFinPreparacionPedido();
    }
    else if (tiempoProximoEvento === proximaLlegadaPedido) {
      return generarLlegadaPedido();
    }

    return generarFinSimulacion(estado, parametros);
  }

  // const {
  //   pedidos: {
  //     sandwiches,
  //     pizzas,
  //     empanadas,
  //     hamburgesas,
  //     lomitos,
  //     ...pedidos
  //   },
  //   envios,
  //   entregas,
  // } = parameters;

  function executeRun(
    parametros: IParameters,
  ): TReplica {
    const vectores: IVectorEstado[] = [];
    let estado: IVectorEstado = generarInicioSimulacion(parametros);

    do {
      estado = executeNext(estado, parametros);
      vectores.push(estado);
    } while (estado.evento !== Evento.FinSimulacion);

    return [];
  }

  async function executeSimulation(
    parametros: IParameters,
    configuracion: IConfiguration,
  ) {
    const {
      runs,
      filter,
    } = configuracion;

    const replicas: TReplica[] = [];
    const r = 0;

    while (r < runs) {
      const replica = executeRun(parametros);

      if (filter(r)) {
        replicas.push(replica);
      }

      // @todo merge results
    }

    return {
      replicas: [],
      resultados: [],
    };
  }

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
          name: 'reloj',
          label: 'Reloj',
          field: (row: IVectorEstado) => row.reloj,
          align: 'right',
          required: true,
        },
        {
          name: 'evento',
          label: 'Evento',
          field: (row: IVectorEstado) => row.evento,
          align: 'right',
          required: true,
        },
      ],
      columnasVisibles: [
        'reloj', 'evento',
      ],

      replicas: [] as TReplica[],
      replica: [] as TReplica, // computed
      loading: false,

      onSubmit: async () => {
        const configuration = {
          runs: state.iteraciones,
          // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
          filter: new Function(
            'n', `return Boolean(${state.condicionMuestreo});`,
          ) as TSamplingFilter,
        };

        state.replicas = [];
        state.replica = [];
        state.loading = true;

        const results = await executeSimulation(props.parameters, configuration);

        state.loading = false;
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
