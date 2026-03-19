import { useState } from 'react'
import { loginRequest } from '../services/auth.service.js'

/**
 * Camada de lógica de estado para o fluxo de login.
 * Responsável por gerenciar estados e orquestrar o service.
 */
export function useLogin() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setIsLoading(true)

    try {
      const result = await loginRequest(login, password)

      localStorage.setItem('access_token', result.token)
      localStorage.setItem('user', JSON.stringify(result.user))

      setSuccessMessage(`Bem-vindo, ${result.user.name}!`)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    login, setLogin,
    password, setPassword,
    isLoading,
    errorMessage,
    successMessage,
    handleSubmit
  }
}
