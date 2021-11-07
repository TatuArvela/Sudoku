const solver = sudoku_solver();

String.prototype.replaceAt = function (index, char) {
  const a = this.split('');
  a[index] = char;
  return a.join('');
};
