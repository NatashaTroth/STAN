// export function deepCopyObject(obj) {
//   return JSON.parse(JSON.stringify(obj));
// }

export function roundToTwoDecimals(num) {
  //source: https://stackoverflow.com/a/41716722
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
