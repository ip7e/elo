import { PropsWithChildren, createContext, useContext } from "react"

type AuthContextType = {
  isSignedIn: boolean
}
const AuthContext = createContext({})

export default AuthContext

export const AuthProvider = ({ isSignedIn, children }: PropsWithChildren<AuthContextType>) => {
  return <AuthContext.Provider value={{ isSignedIn }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within a AuthProvider")
  return context
}
