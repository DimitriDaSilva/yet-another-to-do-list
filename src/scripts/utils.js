export function rgbToHex(rgb) {
  rgb = rgb.toString();
  let a = rgb.split("(")[1].split(")")[0];

  a = a.split(",");

  let b = a.map(function (x) {
    //For each array element
    //Convert to a base16 string
    x = parseInt(x).toString(16);
    //Add zero if we get only one character
    return x.length === 1 ? "0" + x : x;
  });

  b = "#" + b.join("");

  return b;
}

export function getParentElement(object, tag) {
  if (object.tagName === tag) {
    return object;
  }
  // Stop the recursive calls if it gets to the body level
  if (object.tagName === "BODY") {
    return {};
  }
  return getParentElement(object.parentElement, tag);
}
