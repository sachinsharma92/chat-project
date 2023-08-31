import './MembersList.css';


interface MembersListProps { 
  memberCount: number;
  onlineMembers: number;
}

function MembersList({ memberCount, onlineMembers }: MembersListProps) {
  return (
    <div className="members-layout">
      <img src={'/assets/members-icon.svg'} className="members-icon" />
      <p>{memberCount} {memberCount > 1 ? "members"  : "member" } </p>

      <img src={'/assets/online-icon.svg'} className="online-icon" />
      <p>{onlineMembers} online </p>
    </div>
  );
}
 
export default MembersList;
