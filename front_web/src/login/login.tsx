import AuthPage from '../components/AuthPage';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <AuthPage />
      </div>
    </div>
  );
}
