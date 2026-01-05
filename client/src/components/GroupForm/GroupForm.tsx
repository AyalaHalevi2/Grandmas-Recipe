import { useState, useEffect } from 'react';
import { validate, CreateGroupSchema } from '@grandmas-recipes/shared-schemas';
import type { Group, GroupPrivacy } from '../../types';
import styles from './GroupForm.module.scss';

interface GroupFormProps {
  group?: Group;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; privacy: GroupPrivacy }) => void;
  isLoading?: boolean;
}

const GroupForm = ({ group, isOpen, onClose, onSubmit, isLoading = false }: GroupFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    privacy: 'public' as GroupPrivacy
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        description: group.description || '',
        privacy: group.privacy
      });
    } else {
      setFormData({
        name: '',
        description: '',
        privacy: 'public'
      });
    }
    setErrors({});
  }, [group, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = validate(CreateGroupSchema, formData);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    onSubmit(result.data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePrivacyChange = (privacy: GroupPrivacy) => {
    setFormData(prev => ({ ...prev, privacy }));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{group ? 'ערוך קבוצה' : 'קבוצה חדשה'}</h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="סגור"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">שם הקבוצה *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? styles.inputError : ''}
              placeholder="לדוגמה: משפחת כהן"
              disabled={isLoading}
            />
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">תיאור (אופציונלי)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? styles.inputError : ''}
              placeholder="ספר על הקבוצה..."
              rows={3}
              disabled={isLoading}
            />
            {errors.description && <span className={styles.error}>{errors.description}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>סוג הקבוצה</label>
            <div className={styles.privacyOptions}>
              <button
                type="button"
                className={`${styles.privacyButton} ${formData.privacy === 'public' ? styles.active : ''}`}
                onClick={() => handlePrivacyChange('public')}
                disabled={isLoading}
              >
                <span className={styles.privacyIcon}>🌐</span>
                <div className={styles.privacyText}>
                  <strong>ציבורי</strong>
                  <small>כולם יכולים למצוא ולהצטרף</small>
                </div>
              </button>

              <button
                type="button"
                className={`${styles.privacyButton} ${formData.privacy === 'private' ? styles.active : ''}`}
                onClick={() => handlePrivacyChange('private')}
                disabled={isLoading}
              >
                <span className={styles.privacyIcon}>🔒</span>
                <div className={styles.privacyText}>
                  <strong>פרטי</strong>
                  <small>רק עם קישור הזמנה</small>
                </div>
              </button>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              ביטול
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'שומר...' : group ? 'עדכן' : 'צור קבוצה'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupForm;
