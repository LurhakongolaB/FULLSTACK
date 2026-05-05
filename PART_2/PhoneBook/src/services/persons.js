import axios from 'axios'
const baseUrl = 'http:/api/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => {
    console.log('GET successful')
    return response.data
  })
}
// Creating a new person object and sending it to the server with POST request
const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => {
    console.log('POST successful')
    return response.data
  })
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => {
    console.log('PUT successful')
    return response.data
  })
}

const remove = id => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => {
    console.log('DELETE successful')
    return response.data
  })
}

export default { getAll, create, update, remove }