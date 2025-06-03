import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    authTokens: null,
  }),
  actions: {
    // ...
    async login(credentials) {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch(`${config.public.apiUrl}users/token/`, {
          method: 'POST',
          body: JSON.stringify(credentials),
        })

        const authTokens = response

        const user = jwtDecode(authTokens.access)
        this.user = user
        this.isAuthenticated = true
        this.authTokens = authTokens

        localStorage.setItem('authTokens', JSON.stringify(authTokens))
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },
     checkAuth() {
      this.authTokens = JSON.parse(localStorage.getItem('authTokens'))
      if (this.authTokens) {
        this.isAuthenticated = true
        this.user = jwtDecode(this.authTokens.access)
      }
    },
    async retrieveValidToken() {
      this.authTokens = JSON.parse(localStorage.getItem('authTokens'))
      if (!this.authTokens) {
        return null
      }

      const user = jwtDecode(this.authTokens.access)
      // Set isExpired to true if token expires in less than a minute from now
      const isExpired = dayjs.unix(user.exp).diff(dayjs(), 'minute') < 1

      if (isExpired) {
        try {
          const newTokens = await this.refreshToken()
          if (newTokens) {
            localStorage.setItem('authTokens', JSON.stringify(newTokens))
            this.authTokens = newTokens
            this.user = jwtDecode(newTokens.access)

            return newTokens.access
          }
        } catch (err) {
          console.error('Error refreshing token', err)
          return null
        }
      }

      return this.authTokens.access
    },
    async refreshToken() {
      const rToken = this.authTokens?.refresh
      if (!rToken) {
        console.error('No refresh token available')
        return null
      }

      try {
        const config = useRuntimeConfig()
        const response = await $fetch(
          `${config.public.apiUrl}users/token/refresh/`,
          {
            method: 'POST',
            body: JSON.stringify({ refresh: rToken }),
          },
        )
        return response
      } catch (error) {
        console.error('Failed to refresh token:', error)
        this.logout()
        return null
      }
    },
      logout() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('authTokens')
    },
  },
})