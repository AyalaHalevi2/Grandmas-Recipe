import GroupCard from '../GroupCard/GroupCard';
import type { Group } from '../../types';
import styles from './GroupList.module.scss';

interface GroupListProps {
  groups: Group[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptySubMessage?: string;
  showJoinButton?: boolean;
  onJoin?: (groupId: string) => void;
}

const GroupList = ({
  groups,
  isLoading = false,
  emptyMessage = 'לא נמצאו קבוצות',
  emptySubMessage,
  showJoinButton = false,
  onJoin
}: GroupListProps) => {
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>טוען קבוצות...</p>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>📁</span>
        <p>{emptyMessage}</p>
        {emptySubMessage && <small>{emptySubMessage}</small>}
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {groups.map((group) => (
        <GroupCard
          key={group._id}
          group={group}
          showJoinButton={showJoinButton}
          onJoin={onJoin}
        />
      ))}
    </div>
  );
};

export default GroupList;
