import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginRequest } from '../services/auth.service.js'

/**
 * Camada de lógica de estado para o fluxo de login.
 * Responsável por gerenciar estados e orquestrar o service.
 */
export function useLogin() {
  const navigate = useNavigate()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [mustChangePassword, setMustChangePassword] = useState(false)
  const [pendingCredentials, setPendingCredentials] = useState({ login: '', password: '' })

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
      navigate('/home', { replace: true })
    } catch (error) {
      if (error.status === 403) {
        setPendingCredentials({ login, password })
        setMustChangePassword(true)
        return
      }
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handlePasswordChanged() {
    setMustChangePassword(false)
    setPendingCredentials({ login: '', password: '' })
    setPassword('')
    setSuccessMessage('Senha alterada com sucesso! Faça login com a nova senha.')
  }

  return {
    login, setLogin,
    password, setPassword,
    isLoading,
    errorMessage,
    successMessage,
    handleSubmit,
    mustChangePassword,
    pendingCredentials,
    handlePasswordChanged
  }
}
