import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAccessibility } from '../../context/AccessibilityContext';
import styles from './AccessibilityWidget.module.scss';

// ============================================
// Icon Components (Inline SVGs for a11y)
// ============================================

const AccessibilityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="24"
    height="24"
    aria-hidden="true"
  >
    <circle cx="12" cy="3" r="2.5" />
    <path d="M12 8v4" />
    <path d="M12 12l-4 8" />
    <path d="M12 12l4 8" />
    <path d="M6 9.5h12" />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="20"
    height="20"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ContrastIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    width="20"
    height="20"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v20" />
    <path d="M12 2a10 10 0 0 1 0 20" fill="currentColor" />
  </svg>
);

const FontSizeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="20"
    height="20"
    aria-hidden="true"
  >
    <text x="3" y="18" fontSize="14" fill="currentColor" stroke="none">A</text>
    <text x="14" y="18" fontSize="10" fill="currentColor" stroke="none">A</text>
  </svg>
);

const LinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="20"
    height="20"
    aria-hidden="true"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const MotionIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="20"
    height="20"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5" />
    <path d="M12 7.5V4" />
    <path d="M16.5 12H20" />
    <path d="M12 16.5V20" />
    <path d="M7.5 12H4" />
  </svg>
);

const DyslexiaIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="20"
    height="20"
    aria-hidden="true"
  >
    <path d="M4 7V4h16v3" />
    <path d="M9 20h6" />
    <path d="M12 4v16" />
  </svg>
);

const ResetIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="20"
    height="20"
    aria-hidden="true"
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const MinusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="16"
    height="16"
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="16"
    height="16"
    aria-hidden="true"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// ============================================
// AccessibilityWidget Component
// ============================================

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  const {
    settings,
    toggleHighContrast,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    toggleHighlightLinks,
    toggleReducedMotion,
    toggleDyslexicFont,
    resetAllSettings,
  } = useAccessibility();

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent): void => {
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }
  }, [isOpen]);

  // Trap focus within panel
  const handlePanelKeyDown = useCallback((event: React.KeyboardEvent): void => {
    if (event.key !== 'Tab' || !panelRef.current) return;

    const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }, []);

  const togglePanel = (): void => {
    setIsOpen(prev => !prev);
  };

  const fontPercentage = Math.round(settings.fontSize * 100);

  const panelContent = (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className={styles.backdrop}
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Button */}
      <button
        ref={triggerRef}
        className={styles.trigger}
        onClick={togglePanel}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls="a11y-panel"
        aria-label={isOpen ? 'סגור אפשרויות נגישות' : 'פתח אפשרויות נגישות'}
        title="אפשרויות נגישות"
      >
        <AccessibilityIcon />
        <span className={styles.triggerLabel}>נגישות</span>
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          id="a11y-panel"
          className={styles.panel}
          role="dialog"
          aria-modal="true"
          aria-label="אפשרויות נגישות"
          onKeyDown={handlePanelKeyDown}
        >
          {/* Header */}
          <div className={styles.header}>
            <h2 className={styles.title}>אפשרויות נגישות</h2>
            <button
              ref={firstFocusableRef}
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="סגור תפריט נגישות"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Options */}
          <div className={styles.options} role="group" aria-label="הגדרות נגישות">
            {/* High Contrast */}
            <button
              className={`${styles.option} ${settings.highContrast ? styles.active : ''}`}
              onClick={toggleHighContrast}
              aria-pressed={settings.highContrast}
            >
              <span className={styles.optionIcon}><ContrastIcon /></span>
              <span className={styles.optionContent}>
                <span className={styles.optionLabel}>ניגודיות גבוהה</span>
                <span className={styles.optionDesc}>הגברת ניגודיות הצבעים</span>
              </span>
              <span className={styles.optionStatus}>
                {settings.highContrast ? 'פעיל' : 'כבוי'}
              </span>
            </button>

            {/* Font Size */}
            <div className={styles.fontSizeControl}>
              <div className={styles.fontSizeHeader}>
                <span className={styles.optionIcon}><FontSizeIcon /></span>
                <span className={styles.optionContent}>
                  <span className={styles.optionLabel}>גודל טקסט</span>
                  <span className={styles.optionDesc}>{fontPercentage}%</span>
                </span>
              </div>
              <div className={styles.fontSizeButtons} role="group" aria-label="שליטה בגודל טקסט">
                <button
                  className={styles.fontSizeBtn}
                  onClick={decreaseFontSize}
                  disabled={settings.fontSize <= 0.8}
                  aria-label="הקטן טקסט"
                >
                  <MinusIcon />
                </button>
                <button
                  className={styles.fontSizeBtn}
                  onClick={resetFontSize}
                  aria-label="אפס גודל טקסט"
                  disabled={settings.fontSize === 1}
                >
                  100%
                </button>
                <button
                  className={styles.fontSizeBtn}
                  onClick={increaseFontSize}
                  disabled={settings.fontSize >= 1.5}
                  aria-label="הגדל טקסט"
                >
                  <PlusIcon />
                </button>
              </div>
            </div>

            {/* Highlight Links */}
            <button
              className={`${styles.option} ${settings.highlightLinks ? styles.active : ''}`}
              onClick={toggleHighlightLinks}
              aria-pressed={settings.highlightLinks}
            >
              <span className={styles.optionIcon}><LinkIcon /></span>
              <span className={styles.optionContent}>
                <span className={styles.optionLabel}>הדגש קישורים</span>
                <span className={styles.optionDesc}>הבלטת קישורים ואלמנטים לחיצים</span>
              </span>
              <span className={styles.optionStatus}>
                {settings.highlightLinks ? 'פעיל' : 'כבוי'}
              </span>
            </button>

            {/* Reduced Motion */}
            <button
              className={`${styles.option} ${settings.reducedMotion ? styles.active : ''}`}
              onClick={toggleReducedMotion}
              aria-pressed={settings.reducedMotion}
            >
              <span className={styles.optionIcon}><MotionIcon /></span>
              <span className={styles.optionContent}>
                <span className={styles.optionLabel}>הפחת תנועה</span>
                <span className={styles.optionDesc}>עצור אנימציות ותנועות</span>
              </span>
              <span className={styles.optionStatus}>
                {settings.reducedMotion ? 'פעיל' : 'כבוי'}
              </span>
            </button>

            {/* Dyslexic Font */}
            <button
              className={`${styles.option} ${settings.dyslexicFont ? styles.active : ''}`}
              onClick={toggleDyslexicFont}
              aria-pressed={settings.dyslexicFont}
            >
              <span className={styles.optionIcon}><DyslexiaIcon /></span>
              <span className={styles.optionContent}>
                <span className={styles.optionLabel}>גופן קריא לדיסלקציה</span>
                <span className={styles.optionDesc}>גופן מותאם לקריאה קלה</span>
              </span>
              <span className={styles.optionStatus}>
                {settings.dyslexicFont ? 'פעיל' : 'כבוי'}
              </span>
            </button>
          </div>

          {/* Reset Button */}
          <div className={styles.footer}>
            <button
              className={styles.resetButton}
              onClick={resetAllSettings}
              aria-label="אפס את כל הגדרות הנגישות"
            >
              <ResetIcon />
              <span>אפס הכל</span>
            </button>
          </div>

          {/* Live Region for Screen Readers */}
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className={styles.srOnly}
          >
            {settings.highContrast && 'מצב ניגודיות גבוהה פעיל. '}
            {settings.highlightLinks && 'הדגשת קישורים פעילה. '}
            {settings.reducedMotion && 'הפחתת תנועה פעילה. '}
            {settings.dyslexicFont && 'גופן דיסלקציה פעיל. '}
            גודל טקסט: {fontPercentage} אחוז.
          </div>
        </div>
      )}
    </>
  );

  // Render via portal to avoid z-index issues
  return createPortal(panelContent, document.body);
}
