import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import styles from './GroupManagement.module.scss';

interface GroupMember {
  userId: {
    _id: string;
    email: string;
    fullName: string;
  };
  role: 'admin' | 'contributor' | 'member';
  joinedAt: string;
}

interface GroupData {
  _id: string;
  name: string;
  description: string;
  privacy: 'public' | 'private';
  contributionRules: 'everyone' | 'managers';
  imageUrl: string;
  creator: {
    _id: string;
    email: string;
    fullName: string;
  };
  members: GroupMember[];
  inviteCode: string;
  createdAt: string;
  updatedAt: string;
}

const GroupManagement = () => {
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchGroups = async (): Promise<void> => {
    try {
      const response = await api.get('/groups/all');
      setGroups(response.data);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('שגיאה בטעינת קבוצות');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleDelete = async (groupId: string): Promise<void> => {
    try {
      await api.delete(`/groups/${groupId}`);
      setDeleteConfirm(null);
      await fetchGroups();
    } catch (err) {
      console.error('Error deleting group:', err);
      setError('שגיאה במחיקת קבוצה');
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.creator?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.creator?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="loading"></div>;
  }

  return (
    <div className={styles.groupManagement}>
      <div className={styles.header}>
        <h2>כל הקבוצות ({groups.length})</h2>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="חיפוש לפי שם קבוצה או יוצר..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>אישור מחיקה</h3>
            <p>האם אתה בטוח שברצונך למחוק קבוצה זו?</p>
            <p>פעולה זו תסיר את כל המתכונים מהקבוצה ואינה ניתנת לביטול.</p>
            <div className={styles.modalActions}>
              <button onClick={() => handleDelete(deleteConfirm)} className={styles.deleteBtn}>מחק</button>
              <button onClick={() => setDeleteConfirm(null)} className={styles.cancelBtn}>ביטול</button>
            </div>
          </div>
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>שם הקבוצה</th>
            <th>יוצר</th>
            <th>סוג</th>
            <th>חברים</th>
            <th>תאריך יצירה</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {filteredGroups.map((group) => (
            <tr key={group._id}>
              <td>
                <Link to={`/groups/${group._id}`} className={styles.groupLink}>
                  {group.name}
                </Link>
              </td>
              <td>
                <div className={styles.creatorInfo}>
                  <span>{group.creator?.fullName || 'לא ידוע'}</span>
                  <small>{group.creator?.email}</small>
                </div>
              </td>
              <td>
                <span className={`${styles.badge} ${styles[group.privacy]}`}>
                  {group.privacy === 'public' ? '🌐 ציבורי' : '🔒 פרטי'}
                </span>
              </td>
              <td>{group.members?.length || 0}</td>
              <td>{new Date(group.createdAt).toLocaleDateString('he-IL')}</td>
              <td className={styles.actions}>
                <Link to={`/groups/${group._id}`} className={styles.viewBtn} title="צפייה">
                  👁️
                </Link>
                <button
                  onClick={() => setDeleteConfirm(group._id)}
                  className={styles.deleteBtn}
                  title="מחיקה"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredGroups.length === 0 && !isLoading && (
        <div className={styles.empty}>
          {searchTerm ? 'לא נמצאו קבוצות התואמות לחיפוש' : 'אין קבוצות במערכת'}
        </div>
      )}
    </div>
  );
};

export default GroupManagement;
