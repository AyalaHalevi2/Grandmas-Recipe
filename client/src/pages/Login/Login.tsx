import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login, clearError } from '../../store/authSlice';
import { validate, LoginSchema } from '@grandmas-recipes/shared-schemas';
import styles from './Login.module.scss';
import logoSVG from '../../assets/pot_no_bg (4).svg';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) dispatch(clearError());
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const result = validate(LoginSchema, formData);

    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    const dispatchResult = await dispatch(login(result.data));
    if (login.fulfilled.match(dispatchResult)) {
      navigate('/');
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <img src={logoSVG} alt="המתכונים של סבתא" className={styles.logo} />
        </div>

        <h1 className={styles.title}>התחברות</h1>
        <p className={styles.subtitle}>ברוכים הבאים למטבח של סבתא</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">אימייל</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="הזינו את כתובת האימייל"
              required
              dir="ltr"
            />
            {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">סיסמה</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="הזינו סיסמה"
                required
                dir="ltr"
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? (
              <span className={styles.loadingState}>
                <span className={styles.spinner} />
                מתחבר...
              </span>
            ) : (
              'התחברות'
            )}
          </button>
        </form>

        <div className={styles.divider}>
          <span>או</span>
        </div>

        <p className={styles.registerLink}>
          אין לכם חשבון? <Link to="/register">הירשמו עכשיו</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
