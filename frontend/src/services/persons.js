import axios from 'axios'

const url = 'http://localhost:3001/api/persons'

const getAll = ()=> axios.get(url).then(response=> response.data);

const post = (person) => axios.post(url,person)

const del = (id) => axios.delete(`${url}/${id}`);

const put = (id,person) => axios.put(`${url}/${id}`,person).then(response => response.data);


export default {getAll, post, del ,put}