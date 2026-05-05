import axios from 'axios'

const baseUrl = '/api/persons'

const getAll = () => {
  return axios.get(baseUrl).then(res => {
    console.log('GET successful')
    return res.data
  })
}

const create = newObject => {
  return axios.post(baseUrl, newObject).then(res => {
    console.log('POST successful')
    return res.data
  })
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject).then(res => {
    console.log('PUT successful')
    return res.data
  })
}

const remove = id => {
  return axios.delete(`${baseUrl}/${id}`).then(res => {
    console.log('DELETE successful')
    return res.data
  })
}

export default { getAll, create, update, remove }