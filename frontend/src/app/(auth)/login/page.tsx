// src/app/(auth)/login/page.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { authClient } from '@/services/authClient';
import { useAppStore } from '@/store/useAppStore';
import toast from 'react-hot-toast';
import styles from '@/app/(auth)/auth.module.css';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
  agree: z.boolean().refine((v) => v === true, { message: 'You must accept the terms' }),
});

type FormSchema = z.infer<typeof schema>;

const SUGGESTION_KEY = 'ribbony_emails';
const SUGGESTION_LIMIT = 6;

function saveEmailSuggestion(email: string) {
  try {
    const raw = localStorage.getItem(SUGGESTION_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    const normalized = email.trim().toLowerCase();
    const filtered = [normalized, ...list.filter((e) => e !== normalized)].slice(0, SUGGESTION_LIMIT);
    localStorage.setItem(SUGGESTION_KEY, JSON.stringify(filtered));
  } catch {
    // ignore
  }
}
function readEmailSuggestions(): string[] {
  try {
    const raw = localStorage.getItem(SUGGESTION_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function EyeIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function EyeOffIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.88 9.88a3 3 0 104.24 4.24" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.46 12.03C3.73 7.97 7.52 5.03 12 5.03c1.61 0 3.15.34 4.53.96" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.54 11.97c-1.27 4.06-5.06 6.99-9.54 6.99-1.58 0-3.1-.33-4.48-.96" />
    </svg>
  );
}

/* Email field with suggestions - uses module styles */
function EmailField({
  value,
  onChange,
  onSelectSuggestion,
  id = 'email',
  placeholder = 'Email',
  error,
  inputRegister,
}: {
  value: string;
  onChange: (v: string) => void;
  onSelectSuggestion: (v: string) => void;
  id?: string;
  placeholder?: string;
  error?: string | undefined;
  inputRegister?: any;
}) {
  const [open, setOpen] = useState(false);
  const suggestions = useMemo(() => readEmailSuggestions(), []);
  const filtered = useMemo(() => {
    const q = (value ?? '').trim().toLowerCase();
    if (!q) return suggestions;
    return suggestions.filter((s) => s.includes(q));
  }, [value, suggestions]);

  useEffect(() => {
    if (!filtered.length) setOpen(false);
  }, [filtered.length]);

  return (
    <div style={{ position: 'relative' }}>
      <input
        id={id}
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 160)}
        placeholder={placeholder}
        autoComplete="email"
        className={styles.input}
        {...(inputRegister || {})}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />

      {open && filtered.length > 0 && (
        <ul className={styles.suggestions} role="listbox" aria-label="Email suggestions">
          {filtered.map((s) => (
            <li
              key={s}
              role="option"
              tabIndex={0}
              onMouseDown={(e) => { e.preventDefault(); onSelectSuggestion(s); setOpen(false); }}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onSelectSuggestion(s); setOpen(false); } }}
              className={styles.suggestionItem}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
      {error && <div id={`${id}-error`} style={{ color: '#dc2626', fontSize: 13, marginTop: 6 }}>{error}</div>}
    </div>
  );
}

/* Password field with toggle */
function PasswordField({ registerReturn, error, id = 'password', placeholder = 'Password' }: { registerReturn: any; error?: string; id?: string; placeholder?: string; }) {
  const [show, setShow] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <input
        id={id}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        className={styles.input}
        {...(registerReturn || {})}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <button type="button" className={styles.passwordToggle} onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
      {error && <div id={`${id}-error`} style={{ color: '#dc2626', fontSize: 13, marginTop: 6 }}>{error}</div>}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAppStore((s) => s.setUser);
  const setLoading = useAppStore((s) => s.setLoading);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', agree: false },
  });

  const watchedEmail = watch('email');
  const [emailLocal, setEmailLocal] = useState<string>('');

  useEffect(() => {
    setEmailLocal(watchedEmail ?? '');
  }, [watchedEmail]);

  const handleSelectSuggestion = (val: string) => {
    setValue('email', val, { shouldValidate: true, shouldDirty: true });
    setEmailLocal(val);
  };

   const onSubmit = async (data: FormSchema) => {
    setLoading(true);
    try {
      // call auth API (your authClient returns parsed body)
      const res = await authClient.login({ email: data.email, password: data.password });

      // if token provided by API, persist it
      if (res?.token) authClient.saveToken(res.token);

      // save email suggestion (existing behavior)
      try { saveEmailSuggestion(data.email); } catch {}

      // set richer user object into your store (non-destructive)
      // API response fields: id, role, firstName (if different names adjust here)
      const userObj = {
        id: res?.id ? String(res.id) : undefined,
        name: res?.name ?? undefined,
        firstName: res?.firstName ?? res?.first_name ?? undefined,
        lastName: res?.lastName ?? res?.last_name ?? undefined,
        role: res?.role ?? undefined,
      };
      setUser(userObj);

      toast.success('Login successful');

      // Redirect by role
      const roleNormalized = (res?.role ?? '').toString().toUpperCase();
      if (roleNormalized === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      toast.error(err?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div>
        <h2 className={styles.heading}>Sign in to your account</h2>
        <p className={styles.helper}>Welcome back — please enter your details.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer} noValidate>
        <div className={styles.field}>
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <EmailField
            id="email"
            value={emailLocal}
            onChange={(v) => { setEmailLocal(v); setValue('email', v, { shouldDirty: true }); }}
            onSelectSuggestion={handleSelectSuggestion}
            placeholder="you@example.com"
            error={errors.email?.message as string | undefined}
            inputRegister={register('email')}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <PasswordField registerReturn={register('password')} error={errors.password?.message as string | undefined} />
        </div>

        <div className={styles.checkboxRow}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" {...register('agree')} />
            <span className={styles.helper}>I agree to Terms of Service & Privacy Policy</span>
          </label>
        </div>
        {errors.agree && <div style={{ color: '#dc2626', fontSize: 13 }}>{errors.agree.message}</div>}

        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <button type="submit" className={styles.primaryBtn}>Sign in</button>
          <button type="button" className={styles.secondaryBtn} onClick={() => router.push('/register')}>Sign up</button>
        </div>

        <div className={styles.meta}>
          <a href="/forgot-password" style={{ color: 'rgba(15,23,42,0.7)', textDecoration: 'underline' }}>Forgot password?</a>
        </div>
      </form>
    </div>
  );
}
