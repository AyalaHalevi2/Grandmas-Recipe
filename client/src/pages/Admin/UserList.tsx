import { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import api from '../../services/api';
import styles from './UserList.module.scss';

interface UserData {
  _id: string;
  email: string;
  fullName: string;
  role: 'sysadmin' | 'user';
  createdAt: string;
}

interface EditingUser {
  _id: string;
  email: string;
  fullName: string;
  role: 'sysadmin' | 'user';
}

const UserList = () => {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<EditingUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (): Promise<void> => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('שגיאה בטעינת משתמשים');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: UserData): void => {
    setEditingUser({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    });
    setError(null);
  };

  const handleSaveEdit = async (): Promise<void> => {
    if (!editingUser) return;

    try {
      await api.put(`/users/${editingUser._id}`, {
        email: editingUser.email,
        fullName: editingUser.fullName,
        role: editingUser.role
      });
      setEditingUser(null);
      await fetchUsers();
    } catch (err) {
      console.error('Error updating user:', err);
      setError('שגיאה בעדכון משתמש');
    }
  };

  const handleDelete = async (userId: string): Promise<void> => {
    try {
      await api.delete(`/users/${userId}`);
      setDeleteConfirm(null);
      await fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('שגיאה במחיקת משתמש');
    }
  };

  if (isLoading) {
    return <div className="loading"></div>;
  }

  return (
    <div className={styles.userList}>
      <h2>משתמשים רשומים ({users.length})</h2>

      {error && <div className={styles.error}>{error}</div>}

      {/* Edit Modal */}
      {editingUser && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>עריכת משתמש</h3>
            <div className={styles.formGroup}>
              <label>שם מלא</label>
              <input
                type="text"
                value={editingUser.fullName}
                onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>אימייל</label>
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>תפקיד</label>
              <select
                value={editingUser.role}
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as 'sysadmin' | 'user' })}
              >
                <option value="user">משתמש</option>
                <option value="sysadmin">מנהל מערכת</option>
              </select>
            </div>
            <div className={styles.modalActions}>
              <button onClick={handleSaveEdit} className={styles.saveBtn}>שמור</button>
              <button onClick={() => setEditingUser(null)} className={styles.cancelBtn}>ביטול</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>אישור מחיקה</h3>
            <p>האם אתה בטוח שברצונך למחוק משתמש זה?</p>
            <p>פעולה זו אינה ניתנת לביטול.</p>
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
            <th>שם מלא</th>
            <th>אימייל</th>
            <th>תפקיד</th>
            <th>תאריך הרשמה</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>
                <span className={`${styles.role} ${styles[user.role]}`}>
                  {user.role === 'sysadmin' ? 'מנהל מערכת' : 'משתמש'}
                </span>
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString('he-IL')}</td>
              <td className={styles.actions}>
                <button
                  onClick={() => handleEdit(user)}
                  className={styles.editBtn}
                  title="עריכה"
                >
                  ✏️
                </button>
                {user._id !== currentUser?._id && (
                  <button
                    onClick={() => setDeleteConfirm(user._id)}
                    className={styles.deleteBtn}
                    title="מחיקה"
                  >
                    🗑️
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
