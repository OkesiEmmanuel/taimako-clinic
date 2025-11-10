'use client';
import { useState } from 'react';

import InputField from './InputField';
import PasswordField from './PasswordField';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button2';

interface Props { type: 'login' | 'register'; }

export default function AuthForm({ type }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    // e.preventDefault();
    // const res = await fetch(`/api/auth/${type}`, {
    //   method: 'POST',
    //   body: JSON.stringify(form),
    //   headers: { 'Content-Type': 'application/json' },
    // });
    // if (res.ok) 
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-sm">
      <h1 className="text-xl font-semibold text-gray-500 mb-4">{type === 'login' ? 'Login' : 'Register'}</h1>
      {type === 'register' && (
        <InputField label="Full Name" name="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      )}
      <InputField label="Email" name="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <PasswordField label="Password" name="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      <div className="mt-3 my-4">
        <Button href="/dashboard" label={type === 'login' ? 'Sign In' : 'Sign Up'} onClick={handleSubmit}   />
      </div>
    </form>
  );
}
