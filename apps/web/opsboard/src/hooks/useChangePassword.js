import { useState } from 'react'
import { changePasswordRequest } from '../services/auth.service.js'

/**
 * Gerencia o fluxo de troca de senha no primeiro acesso.
 * @param {object} pendingCredentials - { login, password } usados no login anterior.
 * @param {function} onSuccess - Callback chamado após a troca bem-sucedida.
 */
export function useChangePassword({ pendingCredentials, onSuccess }) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')

    if (newPassword !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.')
      return
    }

    setIsLoading(true)

    try {
      await changePasswordRequest(pendingCredentials.login, pendingCredentials.password, newPassword)
      onSuccess()
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    isLoading,
    errorMessage,
    handleSubmit
  }
}
