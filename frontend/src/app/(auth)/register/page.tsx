// src/app/(auth)/register/page.tsx
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

const schema = z
  .object({
    firstName: z.string().min(2, 'First name at least 2 chars'),
    lastName: z.string().min(2, 'Last name at least 2 chars'),
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password at least 8 chars'),
    confirmPassword: z.string().min(8, 'Confirm your password'),
    agree: z.boolean().refine((v) => v === true, { message: 'You must accept the terms' }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
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

/* Email suggestions field */
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
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
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
              onMouseDown={(e) => {
                e.preventDefault();
                onSelectSuggestion(s);
                setOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onSelectSuggestion(s);
                  setOpen(false);
                }
              }}
              className={styles.suggestionItem}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
      {error && (
        <div id={`${id}-error`} style={{ color: '#dc2626', fontSize: 13, marginTop: 6 }}>
          {error}
        </div>
      )}
    </div>
  );
}

/* Password field */
function PasswordField({ registerReturn, error, id = 'password', placeholder = 'Password' }: { registerReturn: any; error?: string; id?: string; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input id={id} type={show ? 'text' : 'password'} placeholder={placeholder} className={styles.input} {...(registerReturn || {})} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} />
      <button type="button" className={styles.passwordToggle} onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
      {error && (
        <div id={`${id}-error`} style={{ color: '#dc2626', fontSize: 13, marginTop: 6 }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAppStore((s) => s.setUser);
  const setLoading = useAppStore((s) => s.setLoading);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '', agree: false },
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
      const res = await authClient.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      if (res?.token) authClient.saveToken(res.token);

      try {
        saveEmailSuggestion(data.email);
      } catch {}

      setUser({ id: String(res.id), name: `${data.firstName} ${data.lastName}` });

      toast.success('Account created successfully');
      router.push('/');
    } catch (err: any) {
      toast.error(err?.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div>
        <h2 className={styles.heading}>Create your account</h2>
        <p className={styles.helper}>Join us — create a new account.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer} noValidate>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="firstName" className="text-sm font-medium">First name</label>
            <input id="firstName" placeholder="First name" className={styles.input} {...register('firstName')} />
            {errors.firstName && <div style={{ color: '#dc2626', fontSize: 13, marginTop: 6 }}>{errors.firstName.message}</div>}
          </div>

          <div style={{ flex: 1 }}>
            <label htmlFor="lastName" className="text-sm font-medium">Last name</label>
            <input id="lastName" placeholder="Last name" className={styles.input} {...register('lastName')} />
            {errors.lastName && <div style={{ color: '#dc2626', fontSize: 13, marginTop: 6 }}>{errors.lastName.message}</div>}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <EmailField id="email" value={emailLocal} onChange={(v) => { setEmailLocal(v); setValue('email', v, { shouldDirty: true }); }} onSelectSuggestion={handleSelectSuggestion} placeholder="you@example.com" error={errors.email?.message as string | undefined} inputRegister={register('email')} />
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <PasswordField registerReturn={register('password')} error={errors.password?.message as string | undefined} />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm password</label>
          <PasswordField registerReturn={register('confirmPassword')} error={errors.confirmPassword?.message as string | undefined} id="confirmPassword" />
        </div>

        <div className={styles.checkboxRow}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" {...register('agree')} />
            <span className={styles.helper}>I agree to Terms of Service & Privacy Policy</span>
          </label>
        </div>
        {errors.agree && <div style={{ color: '#dc2626', fontSize: 13 }}>{errors.agree.message}</div>}

        <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
          <button type="submit" className={styles.primaryBtn}>Create account</button>
          <button type="button" className={styles.secondaryBtn} onClick={() => router.push('/login')}>Back to login</button>
        </div>

        <div className={styles.meta}>
          Already have an account? <a href="/login" style={{ color: 'rgba(15,23,42,0.8)', textDecoration: 'underline' }}>Sign in</a>
        </div>
      </form>
    </div>
  );
}
