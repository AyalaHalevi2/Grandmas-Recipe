import { useState, useEffect } from 'react';
import { validate, CreateGroupSchema } from '@grandmas-recipes/shared-schemas';
import type { Group, GroupPrivacy, ContributionRules } from '../../types';
import styles from './GroupForm.module.scss';

interface GroupFormData {
  name: string;
  description: string;
  privacy: GroupPrivacy;
  contributionRules: ContributionRules;
  imageUrl: string;
}

interface GroupFormProps {
  group?: Group;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GroupFormData) => void;
  isLoading?: boolean;
}

const GroupForm = ({ group, isOpen, onClose, onSubmit, isLoading = false }: GroupFormProps) => {
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    description: '',
    privacy: 'public',
    contributionRules: 'everyone',
    imageUrl: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        description: group.description || '',
        privacy: group.privacy,
        contributionRules: group.contributionRules || 'everyone',
        imageUrl: group.imageUrl || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        privacy: 'public',
        contributionRules: 'everyone',
        imageUrl: ''
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

  const handleContributionRulesChange = (contributionRules: ContributionRules) => {
    setFormData(prev => ({ ...prev, contributionRules }));
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

          <div className={styles.formGroup}>
            <label>מי יכול להוסיף מתכונים?</label>
            <div className={styles.privacyOptions}>
              <button
                type="button"
                className={`${styles.privacyButton} ${formData.contributionRules === 'everyone' ? styles.active : ''}`}
                onClick={() => handleContributionRulesChange('everyone')}
                disabled={isLoading}
              >
                <span className={styles.privacyIcon}>👥</span>
                <div className={styles.privacyText}>
                  <strong>כל חבר</strong>
                  <small>כל חברי הקבוצה יכולים להוסיף מתכונים</small>
                </div>
              </button>

              <button
                type="button"
                className={`${styles.privacyButton} ${formData.contributionRules === 'managers' ? styles.active : ''}`}
                onClick={() => handleContributionRulesChange('managers')}
                disabled={isLoading}
              >
                <span className={styles.privacyIcon}>👑</span>
                <div className={styles.privacyText}>
                  <strong>מנהלים בלבד</strong>
                  <small>רק מנהלי הקבוצה יכולים להוסיף מתכונים</small>
                </div>
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="imageUrl">תמונת קבוצה (אופציונלי)</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className={errors.imageUrl ? styles.inputError : ''}
              placeholder="הכנס קישור לתמונה..."
              disabled={isLoading}
            />
            {errors.imageUrl && <span className={styles.error}>{errors.imageUrl}</span>}
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
