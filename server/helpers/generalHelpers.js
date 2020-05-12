// export function deepCopyObject(obj) {
//   return JSON.parse(JSON.stringify(obj));
// }
import validator from "validator";

export function roundToTwoDecimals(num) {
  //source: https://stackoverflow.com/a/41716722
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function escapeObjectForHtml(unescapedObject) {
  const escapedObject = { ...unescapedObject };
  for (var key in escapedObject) {
    if (
      typeof escapedObject[key] === "string" ||
      escapedObject[key] instanceof String
    )
      escapedObject[key] = escapeStringForHtml(escapedObject[key]);
    else if (Array.isArray(escapedObject[key])) {
      escapedObject[key] = escapeArrayForHtml(escapedObject[key]);
    }
  }
  return escapedObject;
}

export function escapeArrayForHtml(unescapedArray) {
  for (let i = 0; i < unescapedArray.length; i++) {
    unescapedArray[i] = escapeStringForHtml(unescapedArray[i]);
  }
  return unescapedArray;
}

export function escapeStringForHtml(value) {
  if (typeof value === "string" || value instanceof String)
    return validator.escape(value);
  else return value;
}

// function(obj, label) {
//   if(obj.label === label) { return obj; }
//   for(var i in obj) {
//       if(obj.hasOwnProperty(i)){
//           var foundLabel = findObjectByLabel(obj[i], label);
//           if(foundLabel) { return foundLabel; }
//       }
//   }
//   return null;
// };
