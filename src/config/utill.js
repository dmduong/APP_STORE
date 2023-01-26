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

export const getItem =  (name) => {
    const data = localStorage.getItem(name);
    return JSON.parse(data);
}

export const remoteItem = (name) => {
    localStorage.removeItem(name);
}
