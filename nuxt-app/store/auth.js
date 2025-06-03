import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    authTokens: null,
  }),
  actions: {
    async register(credentials) {
      const config = useRuntimeConfig()
      try {
        const response = await fetch(`${config.public.apiUrl}users/register/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        })
        const data = await response.json()

        if (response.status !== 201) {
          // Handle validation errors specifically
          if (typeof data === 'object' && data !== null) {
            const errors = Object.values(data)
            if (errors.length > 0 && errors[0].length > 0) {
              // Extract the first error message from the first property with an error
              throw new Error(errors[0][0])
            }
          }

          // Fallback error message if the structure wasn't as expected
          throw new Error('Registration failed due to an unexpected error.')
        }

        return data // On success, return the response data
      } catch (error) {
        return {
          error: error.message || 'An error occurred during registration.',
        }
      }
    },
     async authedRequest(url, originalConfig = {}) {
      const config = { ...originalConfig }
      // Explained below
      const accessToken = await this.retrieveValidToken()

      if (!accessToken) {
        return Promise.reject('No auth token found')
      }

      if (!config.headers) {
        config.headers = {}
      }
      config.headers['Authorization'] = `Bearer ${accessToken}`

      if (config.data) {
        config.body = config.data
        delete config.data
      }

      try {
        return await fetch(url, config)
      } catch (error) {
        console.error('Failed to make authenticated request:', error)
        return Promise.reject(error)
      }
    },
    async makeRequest(method, url, data = {}, config = {}) {
      config.method = method
      if (data && Object.keys(data).length > 0) {
        config.data = data
      }
      return await this.authedRequest(url, config)
    },
    async authedPost(url, data, config = {}) {
      return this.makeRequest('POST', url, data, config)
    },
    async authedPut(url, data, config = {}) {
      return this.makeRequest('PUT', url, data, config)
    },
    async authedGet(url, config = {}) {
      return this.makeRequest('GET', url, null, config)
    },
    async authedDelete(url, config = {}) {
      return this.makeRequest('DELETE', url, null, config)
    },
       checkAuth() {
          this.authTokens = JSON.parse(localStorage.getItem('authTokens'))
          if (this.authTokens) {
            this.isAuthenticated = true
            this.user = jwtDecode(this.authTokens.access)
          }
        },
  },
})