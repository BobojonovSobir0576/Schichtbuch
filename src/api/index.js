import axios from 'axios';

export const url = 'http://192.168.0.163:8005/';

export const create = async (data) => {
  return await axios.post(url + 'api/items/', data).then((res) => {
    console.log(res)
    return res;
  });
};

export const fetchGet = async (page = 1) => {
  return await axios.get(url + `api/items/?page=${page}`);
};
export const fetchGetMa = async () => {
  return await axios.get(url + `api/items/ma`);
};
export const updated = async (id, notes) => {
  return await axios.patch(url + `api/items/${id}`, notes);
};
export const fetchSearch = async (fromDate, toDate, status, ma, machine) => {
  return await axios.get(
    url +
      `api/items/?${fromDate ? 'from_date=' + fromDate : '&'}&${
        toDate ? 'to_date=' + toDate : '&'
      }&${status ? 'status=' + status : '&'}&${ma ? 'ma=' + ma : '&'}&${
        machine ? 'machine=' + machine : '&'
      }`
  );
};
export const fetchSort = async (page = 1, sortBy, sortOrder) => {
  return await axios.get(
    url + `api/items/?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`
  );
};
