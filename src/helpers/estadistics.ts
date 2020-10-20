export function media(dia: number, mediaAnterior: number, ingreso: number) {
  let suma = 0;
  // eslint-disable-next-line no-mixed-operators
  suma = (1 / dia * ((dia - 1) * mediaAnterior + ingreso));
  return Number(suma.toFixed(4));
}
export function desviacion(dia: number, varianzaAnterior: number,
  mediaAnterior: number, media: number, ingreso: number) {
  let varianza = 0;
  // eslint-disable-next-line no-mixed-operators
  varianza = varianzaAnterior + (ingreso - mediaAnterior) * (ingreso - media);
  const desviacion = Math.sqrt(varianza / dia);
  return Number(desviacion.toFixed(4));
}
