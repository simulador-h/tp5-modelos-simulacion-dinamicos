export function media(dia: number, mediaAnterior: number, ingreso: number) {
  let suma = 0;
  // eslint-disable-next-line no-mixed-operators
  suma = (1 / dia * ((dia - 1) * mediaAnterior + ingreso));
  return Number(suma.toFixed(4));
}
export function desviacionProm(dia: number, desviacionAnterior: number, media: number, ingreso: number) {
  let suma = 0;
  const desviacion = Math.abs(ingreso - media);
  // eslint-disable-next-line no-mixed-operators
  suma = (1 / dia * ((dia - 1) * desviacionAnterior + desviacion));
  return Number(suma.toFixed(4));
}
