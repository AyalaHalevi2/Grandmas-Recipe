import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAccessibility } from '../../context/AccessibilityContext';
import styles from './AccessibilityWidget.module.scss';

// Import SVG icons from assets
import accessibilityIcon from '../../assets/accessibility.svg';
import closeIcon from '../../assets/close.svg';
import contrastIcon from '../../assets/contrast.svg';
import fontSizeIcon from '../../assets/font-size.svg';
import linkIcon from '../../assets/link.svg';
import motionIcon from '../../assets/motion.svg';
import dyslexiaIcon from '../../assets/dyslexia.svg';
import resetIcon from '../../assets/reset.svg';
import minusIcon from '../../assets/minus.svg';
import plusIcon from '../../assets/plus.svg';

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
        <img src={accessibilityIcon} alt="" aria-hidden="true" />
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
              <img src={closeIcon} alt="" aria-hidden="true" />
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
              <span className={styles.optionIcon}>
                <img src={contrastIcon} alt="" aria-hidden="true" />
              </span>
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
                <span className={styles.optionIcon}>
                  <img src={fontSizeIcon} alt="" aria-hidden="true" />
                </span>
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
                  <img src={minusIcon} alt="" aria-hidden="true" />
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
                  <img src={plusIcon} alt="" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Highlight Links */}
            <button
              className={`${styles.option} ${settings.highlightLinks ? styles.active : ''}`}
              onClick={toggleHighlightLinks}
              aria-pressed={settings.highlightLinks}
            >
              <span className={styles.optionIcon}>
                <img src={linkIcon} alt="" aria-hidden="true" />
              </span>
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
              <span className={styles.optionIcon}>
                <img src={motionIcon} alt="" aria-hidden="true" />
              </span>
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
              <span className={styles.optionIcon}>
                <img src={dyslexiaIcon} alt="" aria-hidden="true" />
              </span>
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
              <img src={resetIcon} alt="" aria-hidden="true" />
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
