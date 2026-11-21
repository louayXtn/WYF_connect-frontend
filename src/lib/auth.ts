export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

export function getToken(): string | null {
  return getCookie('wyf_token');
}

export function getCurrentUser(): AuthUser | null {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      role: payload.role
    };
  } catch {
    return null;
  }
}

export function logout() {
  document.cookie = 'wyf_token=; path=/; max-age=0';
  window.location.href = '/auth/sign-in';
}