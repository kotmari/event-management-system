import type { JSX } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { Navigate } from "react-router-dom"


export const ProtectedRoute = ({children}: {children: JSX.Element}) => {
   const isAuthenticated = useAuthStore((state)=> !!state.token)

   if(!isAuthenticated) {
     return <Navigate to="/auth/login" replace />
   }

  return children
}
