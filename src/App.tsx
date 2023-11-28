import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { auth, db } from './firebase'
import HomePage from './pages/HomePage'
import RootLayout from './pages/RootLayout'
import AuthLayout from './pages/auth/AuthLayout'
import LoginPage from './pages/auth/LoginPage'
import LogoutPage from './pages/auth/LogoutPage'
import { useAppDispatch } from './redux/hooks'
import { setUser } from './redux/slices/authSlice'

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const user = localStorage.getItem('user')
    dispatch(setUser(user))

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid

        const snapshot = await getDoc(doc(db, 'users', userId))
        const data = snapshot.data() as { role: string }

        const newUser: User = {
          id: userId,
          email: user.email!,
          name: user.displayName || '',
          role: data.role,
        }

        localStorage.setItem('user', JSON.stringify(newUser))

        dispatch(setUser(newUser))
      } else {
        dispatch(setUser(null))
      }
    })
  }, [])

  return (
    <Router>
      <Routes>
        <Route path='/' element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path='logout' element={<LogoutPage />} />
        </Route>
        <Route path='login' element={<AuthLayout />}>
          <Route index element={<LoginPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
function dispatch(arg0: any) {
  throw new Error('Function not implemented.')
}
