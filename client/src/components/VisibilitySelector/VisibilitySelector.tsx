import { useState, useEffect } from 'react';
import type { RecipeVisibility, Group } from '../../types';
import styles from './VisibilitySelector.module.scss';

interface VisibilitySelectorProps {
  value: RecipeVisibility;
  selectedGroups: string[];
  availableGroups: Group[];
  onChange: (visibility: RecipeVisibility, groupIds: string[]) => void;
  disabled?: boolean;
}

const VisibilitySelector = ({
  value,
  selectedGroups,
  availableGroups,
  onChange,
  disabled = false
}: VisibilitySelectorProps) => {
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);

  useEffect(() => {
    // If visibility is not 'group', clear selected groups
    if (value !== 'group' && selectedGroups.length > 0) {
      onChange(value, []);
    }
  }, [value]);

  const handleVisibilityChange = (newVisibility: RecipeVisibility) => {
    if (newVisibility === 'group') {
      onChange(newVisibility, selectedGroups);
    } else {
      onChange(newVisibility, []);
    }
  };

  const handleGroupToggle = (groupId: string) => {
    const newSelectedGroups = selectedGroups.includes(groupId)
      ? selectedGroups.filter(id => id !== groupId)
      : [...selectedGroups, groupId];

    onChange('group', newSelectedGroups);
  };

  const getSelectedGroupsText = (): string => {
    if (selectedGroups.length === 0) return 'בחר קבוצות...';
    if (selectedGroups.length === 1) {
      const group = availableGroups.find(g => g._id === selectedGroups[0]);
      return group?.name || 'קבוצה אחת';
    }
    return `${selectedGroups.length} קבוצות`;
  };

  return (
    <div className={styles.container}>
      <label>נראות המתכון</label>

      <div className={styles.visibilityOptions}>
        <button
          type="button"
          className={`${styles.visibilityButton} ${value === 'private' ? styles.active : ''}`}
          onClick={() => handleVisibilityChange('private')}
          disabled={disabled}
        >
          <span className={styles.icon}>🔒</span>
          <div className={styles.optionText}>
            <strong>פרטי</strong>
            <small>רק אני יכול לראות</small>
          </div>
        </button>

        <button
          type="button"
          className={`${styles.visibilityButton} ${value === 'group' ? styles.active : ''}`}
          onClick={() => handleVisibilityChange('group')}
          disabled={disabled}
        >
          <span className={styles.icon}>👥</span>
          <div className={styles.optionText}>
            <strong>קבוצתי</strong>
            <small>רק חברי הקבוצה</small>
          </div>
        </button>

        <button
          type="button"
          className={`${styles.visibilityButton} ${value === 'public' ? styles.active : ''}`}
          onClick={() => handleVisibilityChange('public')}
          disabled={disabled}
        >
          <span className={styles.icon}>🌐</span>
          <div className={styles.optionText}>
            <strong>ציבורי</strong>
            <small>כולם יכולים לראות</small>
          </div>
        </button>
      </div>

      {value === 'group' && (
        <div className={styles.groupSelector}>
          <label>בחר קבוצות</label>
          <div className={styles.dropdown}>
            <button
              type="button"
              className={styles.dropdownButton}
              onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)}
              disabled={disabled}
            >
              <span>{getSelectedGroupsText()}</span>
              <span className={styles.arrow}>{isGroupDropdownOpen ? '▲' : '▼'}</span>
            </button>

            {isGroupDropdownOpen && (
              <div className={styles.dropdownMenu}>
                {availableGroups.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>אין לך קבוצות זמינות</p>
                    <small>צור קבוצה חדשה כדי לשתף מתכונים</small>
                  </div>
                ) : (
                  availableGroups.map(group => (
                    <label key={group._id} className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={selectedGroups.includes(group._id)}
                        onChange={() => handleGroupToggle(group._id)}
                        disabled={disabled}
                      />
                      <span className={styles.groupName}>{group.name}</span>
                      <span className={styles.groupPrivacy}>
                        {group.privacy === 'private' ? '🔒' : '🌐'}
                      </span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>
          {value === 'group' && selectedGroups.length === 0 && (
            <span className={styles.warning}>
              ⚠️ יש לבחור לפחות קבוצה אחת
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default VisibilitySelector;
