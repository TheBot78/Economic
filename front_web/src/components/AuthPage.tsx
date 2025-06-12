import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add real authentication logic here, e.g. call API

    // On success:
    login(); // This updates auth state globally and triggers App to show calculators
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isRegister ? 'Register' : 'Login'}
      </h2>
      <form onSubmit={handleLoginSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full rounded border px-3 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full rounded border px-3 py-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition"
        >
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        {isRegister ? (
          <>
            Already have an account?{' '}
            <button
              onClick={() => setIsRegister(false)}
              className="text-blue-600 hover:underline"
            >
              Login here
            </button>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <button
              onClick={() => setIsRegister(true)}
              className="text-blue-600 hover:underline"
            >
              Register here
            </button>
          </>
        )}
      </p>
    </>
  );
}
