import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMyGroups, fetchPublicGroups, createGroup, joinPublicGroup } from '../../store/groupSlice';
import GroupList from '../../components/GroupList/GroupList';
import GroupForm from '../../components/GroupForm/GroupForm';
import type { GroupPrivacy } from '../../types';
import styles from './Groups.module.scss';

type TabType = 'my' | 'public';

const Groups = () => {
  const dispatch = useAppDispatch();
  const { groups, publicGroups, isLoading, error } = useAppSelector(state => state.groups);

  const [activeTab, setActiveTab] = useState<TabType>('my');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchMyGroups());
  }, [dispatch]);

  useEffect(() => {
    if (activeTab === 'public') {
      dispatch(fetchPublicGroups(searchTerm));
    }
  }, [activeTab, dispatch]);

  const handleSearch = () => {
    if (activeTab === 'public') {
      dispatch(fetchPublicGroups(searchTerm));
    }
  };

  const handleCreateGroup = async (data: { name: string; description: string; privacy: GroupPrivacy }) => {
    try {
      await dispatch(createGroup(data)).unwrap();
      setIsFormOpen(false);
      // Refresh my groups list
      dispatch(fetchMyGroups());
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      await dispatch(joinPublicGroup(groupId)).unwrap();
      // Refresh both lists
      dispatch(fetchMyGroups());
      dispatch(fetchPublicGroups(searchTerm));
    } catch (error) {
      console.error('Failed to join group:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>הקבוצות שלי</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className={styles.createButton}
        >
          + צור קבוצה חדשה
        </button>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'my' ? styles.active : ''}`}
          onClick={() => setActiveTab('my')}
        >
          הקבוצות שלי
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'public' ? styles.active : ''}`}
          onClick={() => setActiveTab('public')}
        >
          קבוצות ציבוריות
        </button>
      </div>

      {activeTab === 'public' && (
        <div className={styles.searchSection}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="חפש קבוצות..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className={styles.searchButton}>
              🔍 חפש
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          ⚠️ {error}
        </div>
      )}

      {activeTab === 'my' ? (
        <GroupList
          groups={groups}
          isLoading={isLoading}
          emptyMessage="עדיין לא הצטרפת לאף קבוצה"
          emptySubMessage="צור קבוצה חדשה או הצטרף לקבוצה ציבורית"
        />
      ) : (
        <GroupList
          groups={publicGroups}
          isLoading={isLoading}
          emptyMessage="לא נמצאו קבוצות ציבוריות"
          emptySubMessage="נסה לחפש עם מילות חיפוש אחרות"
          showJoinButton={true}
          onJoin={handleJoinGroup}
        />
      )}

      <GroupForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateGroup}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Groups;
