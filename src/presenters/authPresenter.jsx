import { useState } from "react"
import { observer } from "mobx-react-lite"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { AuthView } from "src/views/authView"
import { auth } from "src/firestoreModel"

export const Auth = observer(function Auth() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)

  function updateEmailACB(newEmail) {
    setEmail(newEmail)
  }

  function updatePasswordACB(newPassword) {
    setPassword(newPassword)
  }

  function submitAuthACB() {
    if (isSignUp) {
      createUserWithEmailAndPassword(auth, email, password)
        .catch(function errorACB(error) {
          setError(error.message)
        })
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .catch(function errorACB(error) {
          setError(error.message)
        })
    }
  }

  function toggleModeACB() {
    setIsSignUp(!isSignUp)
    setError("")
  }

  return (
    <AuthView
      email={email}
      password={password}
      error={error}
      isSignUp={isSignUp}
      onEmailChange={updateEmailACB}
      onPasswordChange={updatePasswordACB}
      onSubmit={submitAuthACB}
      onToggleMode={toggleModeACB}
    />
  )
})