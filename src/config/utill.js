export const timeToString = (dateTime) => {
  var date = new Date(Number(dateTime));
  return (
    date.getDate() +
    "/" +
    (date.getMonth() + 1) +
    "/" +
    date.getFullYear() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds()
  );
};

export const setItem = (name, data) => {
  localStorage.setItem(name, JSON.stringify(data));
};

export const getItem = (name) => {
  const data = localStorage.getItem(name);
  return JSON.parse(data);
};

export const remoteItem = (name) => {
  localStorage.removeItem(name);
};

export const formatCash = (str, dv = "") => {
  const _price = str
    .toString()
    .split("")
    .reverse()
    .reduce((prev, next, index) => {
      return (index % 3 ? next : next + ",") + prev;
    });

  return _price + " (" + dv + ")";
};

export const newArray = (size) => {
  var x = [];
  for (var i = 0; i < size; ++i) {
    x[i] = i;
  }
  return x;
};

export const uniqueArray = (arrs) => {
  const arr = [];
  for (let i = 0; i < arrs.length; i++) {
    if (!arr.includes(arrs[i])) {
      arr.push(arrs[i]);
    }
  }
  return arr;
};
