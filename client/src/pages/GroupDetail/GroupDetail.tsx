import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchGroupById,
  updateGroup,
  deleteGroup,
  leaveGroup,
  fetchGroupMembers,
  inviteMember,
  updateMemberRole,
  removeMember
} from '../../store/groupSlice';
import { fetchRecipes } from '../../store/recipeSlice';
import MemberList from '../../components/MemberList/MemberList';
import GroupForm from '../../components/GroupForm/GroupForm';
import InviteModal from '../../components/InviteModal/InviteModal';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import type { GroupPrivacy, GroupRole } from '../../types';
import styles from './GroupDetail.module.scss';

type TabType = 'recipes' | 'members' | 'settings';

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentGroup, members, isLoading, error } = useAppSelector(state => state.groups);
  const { recipes, isLoading: recipesLoading } = useAppSelector(state => state.recipes);
  const user = useAppSelector(state => state.auth.user);

  const [activeTab, setActiveTab] = useState<TabType>('recipes');
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Permission checks
  const isCreator = user && currentGroup && currentGroup.creator === user._id;
  const currentMember = currentGroup?.members.find(m => m.userId === user?._id);
  const isAdmin = currentMember?.role === 'admin' || isCreator;
  const isContributor = currentMember?.role === 'contributor' || isAdmin;

  useEffect(() => {
    if (id) {
      dispatch(fetchGroupById(id));
      dispatch(fetchGroupMembers(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (activeTab === 'recipes' && id) {
      // Fetch recipes for this group
      dispatch(fetchRecipes({ filter: 'mygroups' }));
    }
  }, [activeTab, id, dispatch]);

  const handleUpdateGroup = async (data: { name: string; description: string; privacy: GroupPrivacy }) => {
    if (!id) return;

    try {
      await dispatch(updateGroup({ id, data })).unwrap();
      setIsEditFormOpen(false);
      dispatch(fetchGroupById(id));
    } catch (error) {
      console.error('Failed to update group:', error);
    }
  };

  const handleDeleteGroup = async () => {
    if (!id) return;

    try {
      await dispatch(deleteGroup(id)).unwrap();
      navigate('/groups');
    } catch (error) {
      console.error('Failed to delete group:', error);
    }
  };

  const handleLeaveGroup = async () => {
    if (!id) return;

    try {
      await dispatch(leaveGroup(id)).unwrap();
      navigate('/groups');
    } catch (error) {
      console.error('Failed to leave group:', error);
    }
  };

  const handleInviteMember = async (email: string) => {
    if (!id) return;

    try {
      await dispatch(inviteMember({ id, email })).unwrap();
      dispatch(fetchGroupMembers(id));
    } catch (error) {
      console.error('Failed to invite member:', error);
    }
  };

  const handleRoleChange = async (userId: string, role: GroupRole) => {
    if (!id) return;

    try {
      await dispatch(updateMemberRole({ id, userId, role })).unwrap();
      dispatch(fetchGroupMembers(id));
    } catch (error) {
      console.error('Failed to update member role:', error);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!id) return;

    try {
      await dispatch(removeMember({ id, userId })).unwrap();
      dispatch(fetchGroupMembers(id));
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  if (isLoading && !currentGroup) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>טוען קבוצה...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>⚠️ שגיאה</h2>
        <p>{error}</p>
        <Link to="/groups" className={styles.backButton}>
          חזור לקבוצות
        </Link>
      </div>
    );
  }

  if (!currentGroup) {
    return null;
  }

  // Filter recipes for this group
  const groupRecipes = recipes.filter(recipe =>
    recipe.groupIds && recipe.groupIds.includes(id || '')
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/groups" className={styles.backLink}>
            ← חזור לקבוצות
          </Link>
          <h1>{currentGroup.name}</h1>
          {currentGroup.description && (
            <p className={styles.description}>{currentGroup.description}</p>
          )}
          <div className={styles.badges}>
            <span className={`${styles.badge} ${currentGroup.privacy === 'private' ? styles.privateBadge : styles.publicBadge}`}>
              {currentGroup.privacy === 'private' ? '🔒 פרטי' : '🌐 ציבורי'}
            </span>
            <span className={styles.badge}>
              👥 {currentGroup.members.length} חברים
            </span>
          </div>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'recipes' ? styles.active : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          מתכונים
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'members' ? styles.active : ''}`}
          onClick={() => setActiveTab('members')}
        >
          חברים
        </button>
        {isAdmin && (
          <button
            className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            הגדרות
          </button>
        )}
      </div>

      <div className={styles.content}>
        {activeTab === 'recipes' && (
          <div className={styles.recipesTab}>
            {isContributor && (
              <div className={styles.addRecipeSection}>
                <Link to="/admin/recipes" className={styles.addRecipeButton}>
                  + הוסף מתכון לקבוצה
                </Link>
              </div>
            )}

            {recipesLoading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>טוען מתכונים...</p>
              </div>
            ) : groupRecipes.length === 0 ? (
              <div className={styles.empty}>
                <p>עדיין אין מתכונים בקבוצה זו</p>
                {isContributor && (
                  <small>היה הראשון להוסיף מתכון!</small>
                )}
              </div>
            ) : (
              <div className={styles.recipeGrid}>
                {groupRecipes.map(recipe => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div className={styles.membersTab}>
            {isAdmin && (
              <div className={styles.inviteSection}>
                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  className={styles.inviteButton}
                >
                  + הזמן חברים
                </button>
              </div>
            )}

            <MemberList
              members={members}
              currentUserId={user?._id}
              canManage={isAdmin || false}
              onRoleChange={handleRoleChange}
              onRemove={handleRemoveMember}
            />
          </div>
        )}

        {activeTab === 'settings' && isAdmin && (
          <div className={styles.settingsTab}>
            <div className={styles.settingsSection}>
              <h3>עריכת קבוצה</h3>
              <button
                onClick={() => setIsEditFormOpen(true)}
                className={styles.editButton}
              >
                ערוך פרטי קבוצה
              </button>
            </div>

            <div className={styles.settingsSection}>
              <h3>אזור מסוכן</h3>
              {isCreator ? (
                <>
                  <p>מחיקת הקבוצה היא פעולה בלתי הפיכה.</p>
                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className={styles.deleteButton}
                    >
                      מחק קבוצה
                    </button>
                  ) : (
                    <div className={styles.confirmDelete}>
                      <p>האם אתה בטוח? פעולה זו לא ניתנת לביטול!</p>
                      <div className={styles.confirmButtons}>
                        <button
                          onClick={handleDeleteGroup}
                          className={styles.confirmButton}
                        >
                          כן, מחק את הקבוצה
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className={styles.cancelButton}
                        >
                          ביטול
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p>עזיבת הקבוצה תסיר אותך מרשימת החברים.</p>
                  <button
                    onClick={handleLeaveGroup}
                    className={styles.leaveButton}
                  >
                    עזוב קבוצה
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {currentGroup && (
        <>
          <GroupForm
            group={currentGroup}
            isOpen={isEditFormOpen}
            onClose={() => setIsEditFormOpen(false)}
            onSubmit={handleUpdateGroup}
            isLoading={isLoading}
          />

          <InviteModal
            isOpen={isInviteModalOpen}
            onClose={() => setIsInviteModalOpen(false)}
            inviteCode={currentGroup.inviteCode}
            onInvite={handleInviteMember}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
};

export default GroupDetail;
