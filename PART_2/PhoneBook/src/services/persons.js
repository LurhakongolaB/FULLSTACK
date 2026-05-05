import axios from 'axios'

// If VITE_BACKEND_URL is defined (on Render), use it. 
// Otherwise, use the relative path (for local proxy).
const backendUrl = import.meta.env.VITE_BACKEND_URL || ''
const baseUrl = `${backendUrl}/api/persons`

const getAll = () => {
  return axios.get(baseUrl).then(res => res.data)
}

const create = newObject => {
  return axios.post(baseUrl, newObject).then(res => res.data)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject).then(res => res.data)
}

const remove = id => {
  return axios.delete(`${baseUrl}/${id}`).then(res => res.data)
}

export default { getAll, create, update, remove }