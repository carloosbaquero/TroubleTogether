import api from './api'

export const setAccessToken = (token) => {
  localStorage.setItem('access', token)
}

export const getAccessToken = () => {
  return localStorage.getItem('access')
}

export const deleteAccessToken = () => {
  localStorage.removeItem('access')
}

export const setRefreshToken = (token) => {
  localStorage.setItem('refresh', token)
}

export const getRefreshToken = () => {
  return localStorage.getItem('refresh')
}

export const deleteRefreshToken = () => {
  localStorage.removeItem('refresh')
}

const refreshToken = async (url) => {
  try {
    const refreshToken = getRefreshToken()
    const { data } = await api.post('/users/refresh', { refreshToken })
    if (data.data.accessToken) {
      return data.data.accessToken
    }
  } catch (e) {
    if (url !== '/users/whoami') {
      console.log('Error', e)
      const currentUrl = window.location.href
      const newUrl = currentUrl.substring(0, currentUrl.indexOf('/')) + '/globetrotters/sign'
      alert('Your session has expired. Please Log in again')
      deleteAccessToken()
      deleteRefreshToken()

      window.location.href = newUrl
    }
  }
}

export const initAxiosAuth = () => {
  api.interceptors.request.use(
    (config) => {
      const token = getAccessToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  api.interceptors.response.use(
    async (response) => {
      const url = response.config.url
      if (url === '/users/whoami' && !response.config._isRetry) {
        if (response.data.data.userId === '') {
          const accessToken = await refreshToken(url)
          setAccessToken(accessToken)

          // Marcar la solicitud como ya reintentada para evitar un bucle infinito
          response.config._isRetry = true

          // Reintentar la solicitud original después de actualizar el token
          response.config.headers.Authorization = `Bearer ${accessToken}`
          return api.request(response.config)
        }
      }
      return response
    },
    async (error) => {
      if (error.response.status === 403 || error.response.status === 401) {
        const token = getAccessToken()
        const refresh = getRefreshToken()
        const url = error.config.url
        if (token && refresh && url !== '/users/refresh' && !error.config._isRetry) {
          try {
            const accessToken = await refreshToken(url)
            setAccessToken(accessToken)

            // Marcar la solicitud como ya reintentada para evitar un bucle infinito
            error.config._isRetry = true

            // Reintentar la solicitud original después de actualizar el token
            error.config.headers.Authorization = `Bearer ${accessToken}`
            return api.request(error.config)
          } catch (refreshError) {
            // Manejar errores de actualización de token aquí
            console.error('Error refreshing token:', refreshError)
            throw refreshError
          }
        }
        if ((!token || !refresh) && url !== '/users/login' && url !== '/users/register' && url !== '/users/whoami') {
          const currentUrl = window.location.href
          const newUrl = currentUrl.substring(0, currentUrl.indexOf('/')) + '/globetrotters/sign'
          alert('Your session has expired. Please Log in again')
          deleteAccessToken()
          deleteRefreshToken()

          window.location.href = newUrl
        }
      }
      return Promise.reject(error)
    }
  )
}
