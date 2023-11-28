import { useAppSelector } from '@/redux/hooks'

export default function useCurrentUser() {
  const user = useAppSelector((state) => state.auth.user)

  return user
}
