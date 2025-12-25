import type { GroupMember, GroupRole } from '../../types';
import styles from './MemberList.module.scss';

interface MemberListProps {
  members: GroupMember[];
  currentUserId?: string;
  canManage?: boolean;
  onRoleChange?: (userId: string, role: GroupRole) => void;
  onRemove?: (userId: string) => void;
}

const MemberList = ({ members, currentUserId, canManage = false, onRoleChange, onRemove }: MemberListProps) => {
  const getRoleBadgeClass = (role: GroupRole) => {
    switch (role) {
      case 'admin': return styles.adminBadge;
      case 'contributor': return styles.contributorBadge;
      default: return styles.memberBadge;
    }
  };

  const getRoleText = (role: GroupRole) => {
    switch (role) {
      case 'admin': return 'מנהל';
      case 'contributor': return 'תורם';
      default: return 'חבר';
    }
  };

  return (
    <div className={styles.memberList}>
      {members.map((member) => (
        <div key={member.userId} className={styles.memberItem}>
          <div className={styles.memberInfo}>
            <div className={styles.avatar}>
              {member.user?.fullName?.[0]?.toUpperCase() || '?'}
            </div>
            <div className={styles.details}>
              <span className={styles.name}>{member.user?.fullName || 'Unknown'}</span>
              <span className={styles.email}>{member.user?.email}</span>
            </div>
          </div>

          <div className={styles.memberActions}>
            <span className={`${styles.roleBadge} ${getRoleBadgeClass(member.role)}`}>
              {getRoleText(member.role)}
            </span>

            {canManage && member.userId !== currentUserId && (
              <div className={styles.actionButtons}>
                {member.role !== 'admin' && onRoleChange && (
                  <button
                    onClick={() => onRoleChange(member.userId, 'admin')}
                    className={styles.iconButton}
                    title="הפוך למנהל"
                  >
                    ⬆️
                  </button>
                )}
                {member.role === 'admin' && onRoleChange && (
                  <button
                    onClick={() => onRoleChange(member.userId, 'contributor')}
                    className={styles.iconButton}
                    title="הפוך לתורם"
                  >
                    ⬇️
                  </button>
                )}
                {onRemove && (
                  <button
                    onClick={() => onRemove(member.userId)}
                    className={`${styles.iconButton} ${styles.removeButton}`}
                    title="הסר חבר"
                  >
                    🗑️
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemberList;
