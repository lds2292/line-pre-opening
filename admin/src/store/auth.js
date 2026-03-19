let _token = localStorage.getItem('admin_token')

export const getAdminToken = () => _token
export const setAdminToken = (t) => {
  _token = t
  localStorage.setItem('admin_token', t)
}
export const clearAdminToken = () => {
  _token = null
  localStorage.removeItem('admin_token')
}
