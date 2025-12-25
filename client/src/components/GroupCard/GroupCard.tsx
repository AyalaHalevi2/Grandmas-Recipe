import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import type { Group } from '../../types';
import styles from './GroupCard.module.scss';

interface GroupCardProps {
  group: Group;
  showJoinButton?: boolean;
  onJoin?: (groupId: string) => void;
}

const GroupCard = ({ group, showJoinButton = false, onJoin }: GroupCardProps) => {
  const { user } = useAppSelector((state) => state.auth);

  const memberCount = group.members?.length || 0;
  const isCreator = user?._id === group.creator;
  const isMember = group.members?.some(m => m.userId === user?._id) || false;

  const handleJoinClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onJoin) {
      onJoin(group._id);
    }
  };

  return (
    <Link to={`/groups/${group._id}`} className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.groupName}>{group.name}</h3>
        <div className={styles.badges}>
          {group.privacy === 'private' && (
            <span className={styles.privateBadge}>🔒 פרטי</span>
          )}
          {isCreator && (
            <span className={styles.creatorBadge}>יוצר</span>
          )}
        </div>
      </div>

      {group.description && (
        <p className={styles.description}>{group.description}</p>
      )}

      <div className={styles.cardFooter}>
        <div className={styles.memberCount}>
          <span className={styles.icon}>👥</span>
          <span>{memberCount} {memberCount === 1 ? 'חבר' : 'חברים'}</span>
        </div>

        {showJoinButton && !isMember && (
          <button
            onClick={handleJoinClick}
            className={styles.joinButton}
          >
            הצטרף
          </button>
        )}
      </div>
    </Link>
  );
};

export default GroupCard;
