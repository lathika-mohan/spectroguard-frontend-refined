import { useAuthContext } from '../context/AuthContext';

export interface UserProfile {
  name?: string;
  username?: string;
  role: string;
  avatar?: string;
}

export const useUser = () => {
  const { user, isLoading } = useAuthContext();

  const userProfile: UserProfile | null = user ? {
    name: user.displayName,
    username: user.username,
    role: user.role,
    avatar: user.avatar ?? undefined
  } : null;

  return { user: userProfile, isLoading, error: null };
};
