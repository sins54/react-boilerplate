/**
 * Pulse HR - Login Page
 * 
 * Authentication page for Pulse HR
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/stores';
import { signIn } from '@/services/authService';
import { isFirebaseConfigured } from '@/lib/firebase';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { setUser, setLoading, setError } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setLoginError(null);
    setLoading(true);

    try {
      const user = await signIn(data.email, data.password);
      setUser(user);
      navigate('/pulse');
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('Invalid email or password');
      setError('Login failed');
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'admin' | 'employee') => {
    setIsSubmitting(true);
    setLoginError(null);
    setLoading(true);

    try {
      const email = role === 'admin' ? 'admin@pulsehr.com' : 'john.doe@pulsehr.com';
      const user = await signIn(email, 'demo123');
      setUser(user);
      navigate('/pulse');
    } catch (error) {
      console.error('Demo login failed:', error);
      setLoginError('Demo login failed');
      setError('Login failed');
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl mx-auto mb-4"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-text-on-primary)',
            }}
          >
            P
          </div>
          <h1
            className="text-3xl font-bold"
            style={{ color: 'var(--color-text)' }}
          >
            Pulse HR
          </h1>
          <p
            className="mt-2"
            style={{ color: 'var(--color-text-muted)' }}
          >
            HRIS & Project Management System
          </p>
        </div>

        {/* Firebase Configuration Warning */}
        {!isFirebaseConfigured && (
          <div
            className="flex items-start gap-3 p-4 rounded-lg mb-6"
            style={{
              backgroundColor: 'var(--color-warning-bg)',
              color: 'var(--color-warning-text)',
            }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Demo Mode</p>
              <p className="text-sm">
                Firebase is not configured. Using mock data for demonstration.
              </p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <div
          className="rounded-lg p-6 shadow-sm border"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          {/* Error Message */}
          {loginError && (
            <div
              className="flex items-center gap-2 p-3 rounded-md mb-4"
              style={{
                backgroundColor: 'var(--color-error-bg)',
                color: 'var(--color-error-text)',
              }}
            >
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{loginError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            {/* Email */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--color-text)' }}
              >
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="you@company.com"
                className="w-full px-3 py-2 rounded-md border text-sm"
                style={{
                  backgroundColor: 'var(--color-bg)',
                  borderColor: errors.email ? 'var(--color-error)' : 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
              {errors.email && (
                <p className="mt-1 text-sm" style={{ color: 'var(--color-error)' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--color-text)' }}
              >
                Password
              </label>
              <input
                type="password"
                {...register('password')}
                placeholder="Enter your password"
                className="w-full px-3 py-2 rounded-md border text-sm"
                style={{
                  backgroundColor: 'var(--color-bg)',
                  borderColor: errors.password ? 'var(--color-error)' : 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
              {errors.password && (
                <p className="mt-1 text-sm" style={{ color: 'var(--color-error)' }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-text-on-primary)',
              }}
            >
              <LogIn className="w-4 h-4" />
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Logins */}
          <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <p
              className="text-center text-sm mb-3"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Quick Demo Access
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleDemoLogin('admin')}
                disabled={isSubmitting}
                className="flex-1 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--color-warning-bg)',
                  color: 'var(--color-warning-text)',
                }}
              >
                Login as Admin
              </button>
              <button
                onClick={() => handleDemoLogin('employee')}
                disabled={isSubmitting}
                className="flex-1 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--color-info-bg)',
                  color: 'var(--color-info-text)',
                }}
              >
                Login as Employee
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p
          className="text-center text-sm mt-6"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Note: Employees cannot sign up. Admins create accounts.
        </p>
      </div>
    </div>
  );
}
