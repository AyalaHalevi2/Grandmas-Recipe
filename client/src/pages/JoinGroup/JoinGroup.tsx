import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { joinViaInvite } from '../../store/groupSlice';
import styles from './JoinGroup.module.scss';

const JoinGroup = () => {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const joinGroup = async () => {
      if (!inviteCode) {
        setStatus('error');
        setError('קוד הזמנה לא תקין');
        return;
      }

      try {
        const result = await dispatch(joinViaInvite(inviteCode)).unwrap();
        setStatus('success');

        // Redirect to the group after a short delay
        setTimeout(() => {
          navigate(`/groups/${result._id}`);
        }, 1500);
      } catch (err: any) {
        setStatus('error');
        setError(err || 'שגיאה בהצטרפות לקבוצה');
      }
    };

    joinGroup();
  }, [inviteCode, dispatch, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {status === 'loading' && (
          <>
            <div className={styles.spinner}></div>
            <h2>מצטרף לקבוצה...</h2>
            <p>אנא המתן</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className={styles.successIcon}>✓</div>
            <h2>הצטרפת בהצלחה!</h2>
            <p>מעביר אותך לדף הקבוצה...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className={styles.errorIcon}>✕</div>
            <h2>שגיאה</h2>
            <p>{error}</p>
            <button
              onClick={() => navigate('/groups')}
              className={styles.backButton}
            >
              חזור לקבוצות
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default JoinGroup;
