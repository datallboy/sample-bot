const isNumeric = n => {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

exports.isNumeric = isNumeric;