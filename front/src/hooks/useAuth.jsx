import { useContext } from 'react'
import { AuthContext } from './src/store/AuthContext'

export const useAuth = () => useContext(AuthContext)
