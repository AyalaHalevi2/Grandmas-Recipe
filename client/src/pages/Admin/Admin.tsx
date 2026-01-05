import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import UserList from './UserList';
import RecipeManagement from './RecipeManagement';
import GroupManagement from './GroupManagement';
import styles from './Admin.module.scss';

type TabType = 'recipes' | 'users' | 'groups';

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<TabType>('recipes');

  useEffect(() => {
    if (!user || user.role !== 'sysadmin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'sysadmin') {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'recipes':
        return <RecipeManagement />;
      case 'users':
        return <UserList />;
      case 'groups':
        return <GroupManagement />;
      default:
        return <RecipeManagement />;
    }
  };

  return (
    <div className={styles.adminPage}>
      <h1>לוח בקרה - מנהל מערכת</h1>

      <div className={styles.tabs}>
        <button
          className={`btn-tab ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          ניהול מתכונים
        </button>
        <button
          className={`btn-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          משתמשים רשומים
        </button>
        <button
          className={`btn-tab ${activeTab === 'groups' ? 'active' : ''}`}
          onClick={() => setActiveTab('groups')}
        >
          כל הקבוצות
        </button>
      </div>

      <div className={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Admin;
