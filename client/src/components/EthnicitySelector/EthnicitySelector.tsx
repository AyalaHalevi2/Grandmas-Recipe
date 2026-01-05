import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import styles from './EthnicitySelector.module.scss';

interface EthnicitySelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

// Emoji mapping for common ethnicities
const getEthnicityEmoji = (ethnicity: string): string => {
  const emojiMap: Record<string, string> = {
    'תימני': '🇾🇪',
    'מרוקאי': '🇲🇦',
    'עיראקי': '🇮🇶',
    'פולני': '🇵🇱',
    'רוסי': '🇷🇺',
    'אתיופי': '🇪🇹',
    'טוניסאי': '🇹🇳',
    'לובי': '🇱🇾',
    'טורקי': '🇹🇷',
    'יווני': '🇬🇷',
    'איטלקי': '🇮🇹',
    'צרפתי': '🇫🇷',
    'ספרדי': '🇪🇸',
    'הודי': '🇮🇳',
    'אשכנזי': '🌍',
    'ספרדי-מזרחי': '🌍',
    'ישראלי': '🇮🇱',
  };
  return emojiMap[ethnicity] || '🍽️';
};

const EthnicitySelector = ({ value, onChange, disabled = false }: EthnicitySelectorProps) => {
  const [existingEthnicities, setExistingEthnicities] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch existing ethnicities
  useEffect(() => {
    const fetchEthnicities = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/recipes/ethnicities');
        setExistingEthnicities(response.data || []);
      } catch (error) {
        console.error('Failed to fetch ethnicities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEthnicities();
  }, []);

  // Sync search term with value prop
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter ethnicities based on search term
  const filteredEthnicities = existingEthnicities.filter(ethnicity =>
    ethnicity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if search term is a new ethnicity (not in existing list)
  const isNewEthnicity = searchTerm.trim() !== '' &&
    !existingEthnicities.some(e => e.toLowerCase() === searchTerm.toLowerCase().trim());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleSelectEthnicity = (ethnicity: string) => {
    setSearchTerm(ethnicity);
    onChange(ethnicity);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setSearchTerm('');
    onChange('');
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'Enter' && searchTerm.trim()) {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>מוצא (אופציונלי)</label>
      <p className={styles.hint}>מאיפה הגיע המתכון למשפחה?</p>

      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder="הקלד או בחר מוצא..."
          className={styles.input}
          disabled={disabled}
        />
        {searchTerm && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
            aria-label="נקה"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && !disabled && (
        <div ref={dropdownRef} className={styles.dropdown}>
          {isLoading ? (
            <div className={styles.loading}>טוען מוצאים...</div>
          ) : (
            <>
              {/* Existing ethnicities section */}
              {filteredEthnicities.length > 0 && (
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>מוצאים קיימים</div>
                  {filteredEthnicities.map(ethnicity => (
                    <button
                      key={ethnicity}
                      type="button"
                      className={styles.option}
                      onClick={() => handleSelectEthnicity(ethnicity)}
                    >
                      <span className={styles.emoji}>{getEthnicityEmoji(ethnicity)}</span>
                      <span className={styles.ethnicity}>{ethnicity}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Add new ethnicity option */}
              {isNewEthnicity && (
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>הוסף מוצא חדש</div>
                  <button
                    type="button"
                    className={`${styles.option} ${styles.newOption}`}
                    onClick={() => handleSelectEthnicity(searchTerm.trim())}
                  >
                    <span className={styles.addIcon}>+</span>
                    <span className={styles.ethnicity}>"{searchTerm.trim()}"</span>
                    <span className={styles.newBadge}>חדש</span>
                  </button>
                </div>
              )}

              {/* Empty state */}
              {filteredEthnicities.length === 0 && !isNewEthnicity && searchTerm && (
                <div className={styles.empty}>
                  לא נמצאו מוצאים. התחל להקליד כדי להוסיף חדש.
                </div>
              )}

              {/* Initial state with popular ethnicities */}
              {!searchTerm && existingEthnicities.length > 0 && (
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>מוצאים נפוצים</div>
                  {existingEthnicities.slice(0, 6).map(ethnicity => (
                    <button
                      key={ethnicity}
                      type="button"
                      className={styles.option}
                      onClick={() => handleSelectEthnicity(ethnicity)}
                    >
                      <span className={styles.emoji}>{getEthnicityEmoji(ethnicity)}</span>
                      <span className={styles.ethnicity}>{ethnicity}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default EthnicitySelector;
