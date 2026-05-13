'use client';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [user, loading, router]);

  if (loading || !user) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl">Welcome, {user.name || user.email}</h1>
      <button onClick={logout} className="mt-4 bg-red-500 text-white p-2 rounded">Logout</button>
      {/* Platform connection & playlist transfer UI will go here */}
    </div>
  );
}