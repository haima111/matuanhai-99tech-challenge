const sum_to_n_a = function (n: number) {
  let result = 0;
  for (let i = 1; i <= n; i++) {
    result += i;
  }
  return result;
};

const sum_to_n_b = function (n: number) {
  return (n * (n + 1)) / 2;
};

const sum_to_n_c = function (n: number) {
  if (n === 1) {
    return 1;
  }
  return n + sum_to_n_c(n - 1);
};
