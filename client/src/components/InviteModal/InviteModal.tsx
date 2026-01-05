import { useState } from 'react';
import { validate, InviteMemberSchema } from '@grandmas-recipes/shared-schemas';
import styles from './InviteModal.module.scss';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteCode: string;
  onInvite: (email: string) => void;
  isLoading?: boolean;
}

const InviteModal = ({ isOpen, onClose, inviteCode, onInvite, isLoading = false }: InviteModalProps) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const inviteLink = `${window.location.origin}/groups/join/${inviteCode}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = validate(InviteMemberSchema, { email });
    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    onInvite(result.data.email);
    setEmail('');
    setErrors({});
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy invite link:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>הזמן חברים</h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="סגור"
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <form onSubmit={handleSubmit} className={styles.inviteForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">הזמן באמצעות אימייל</label>
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors({ ...errors, email: '' });
                    }
                  }}
                  className={errors.email ? styles.inputError : ''}
                  placeholder="example@email.com"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className={styles.inviteButton}
                  disabled={isLoading || !email}
                >
                  {isLoading ? 'שולח...' : 'הזמן'}
                </button>
              </div>
              {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>
          </form>

          <div className={styles.divider}>
            <span>או</span>
          </div>

          <div className={styles.linkSection}>
            <label>קישור הזמנה</label>
            <p className={styles.description}>
              שתף את הקישור הזה עם אנשים שברצונך להזמין לקבוצה
            </p>
            <div className={styles.linkContainer}>
              <input
                type="text"
                value={inviteLink}
                readOnly
                className={styles.linkInput}
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={styles.copyButton}
              >
                {copied ? '✓ הועתק' : '📋 העתק'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
