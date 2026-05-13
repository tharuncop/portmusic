'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await register(email, password, name);
        router.push('/dashboard');
    } catch (err: any) {
        setError(err.response?.data?.error || 'Registration failed');
    }
};

    return (
    <div className="flex min-h-screen items-center justify-center">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-bold">Register</h1>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="border p-2" />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2" required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2" required />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Register</button>
        <a href="/" className="text-sm text-blue-600">Already have an account? Login</a>
      </form>
    </div>
  );
}