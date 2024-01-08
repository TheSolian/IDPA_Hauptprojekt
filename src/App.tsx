import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import EditPage from './components/EditPage'
import MultipleChoiceCreation from './components/MultipleChoiceCreation'
import QuestionList from './components/QuestionList'
import StudentsStats from './components/StudentsStats'
import TrueFalseCreation from './components/TrueFalseCreation'
import UserCreation from './components/UserCreation'
import { auth, db } from './firebase'
import DashboardLayout from './pages/DashboardLayout'
import HomePage from './pages/HomePage'
import QuizPage from './pages/QuizPage'
import RootLayout from './pages/RootLayout'
import StatsPage from './pages/StatsPage'
import StudentsQuiz from './pages/StudentsQuiz'
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
        const data = snapshot.data() as { role: string; username: string }

        const newUser: User = {
          id: userId,
          email: user.email!,
          name: data.username,
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
          <Route path='/quiz' element={<QuizPage />} />
          <Route path='logout' element={<LogoutPage />} />
          <Route path='dashboard' element={<DashboardLayout />}>
            <Route path='createtruefalse' element={<TrueFalseCreation />} />
            <Route
              path='createmultiplechoice'
              element={<MultipleChoiceCreation />}
            />
            <Route path='questions' element={<QuestionList />} />
            <Route path='edit/:id' element={<EditPage />} />
            <Route path='students' element={<StudentsQuiz />} />
            <Route path='student/:id' element={<StudentsStats />} />
          </Route>
          <Route path='statistics' element={<StatsPage />} />
        </Route>
        <Route path='login' element={<AuthLayout />}>
          <Route index element={<LoginPage />} />
          <Route path='signup' element={<UserCreation />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
