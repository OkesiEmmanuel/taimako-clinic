'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputField from './InputField';
import PasswordField from './PasswordField';
import Button from '@/components/ui/Button2';
import { UserRepoSupabase } from '@/repos/supabase/UserRepoSupabase';
import { toast } from 'react-toastify';

interface Props { type: 'login' | 'register'; }

export default function AuthForm({ type }: Props) {
  const router = useRouter();
  const userRepo = UserRepoSupabase.getInstance();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let user;

      if (type === 'login') {
        // Here you would normally call Supabase signIn
        user = await userRepo.findByEmail(form.email);
        if (!user) throw new Error('User not found');
        // TODO: Validate password
      } else {
        // Register
        user = await userRepo.create({
          fullName: form.name,
          email: form.email,
          role: 'reception', // default role for new registration; adjust as needed
          isActive: true,
        });
      }

      // Role-based redirect
      if (user.role === 'admin') {
        router.push('/dashboard');
      } else if (['doctor', 'nurse', 'reception', 'accountant'].includes(user.role)) {
        router.push('/staff/dashboard');
      } else {
        router.push('/patient/dashboard'); // optional patient dashboard
      }

      toast.success(`Welcome back, ${user.fullName}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Login/Register failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-sm">
      <h1 className="text-xl font-semibold text-gray-500 mb-4">{type === 'login' ? 'Login' : 'Register'}</h1>

      {type === 'register' && (
        <InputField
          label="Full Name"
          name="name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
      )}

      <InputField
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />

      <PasswordField
        label="Password"
        name="password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
      />

      <div className="mt-3 my-4">
        <Button type="submit" label={type === 'login' ? 'Sign In' : 'Sign Up'} />
      </div>
    </form>
  );
}
