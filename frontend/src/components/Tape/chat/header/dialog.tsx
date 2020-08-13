import React from 'react';
import { DialogType } from '../../../../hooks/recoil/dialog';
import dayjs from 'dayjs';

import relativeTime from 'dayjs/plugin/relativeTime';
import { useRecoilValueLoadable } from 'recoil';
import { membersByDialog, MemberType } from '../../../../hooks/recoil/members';

dayjs.extend(relativeTime);

declare type PropsType = {
  dialog: DialogType;
};

const Header = ({ dialog }: PropsType) => {
  const { state, contents } = useRecoilValueLoadable(
    membersByDialog({ dialog_id: dialog.id, offset: 0 }),
  );
  const [members, setMembers] = React.useState<MemberType[] | undefined>();

  React.useEffect(() => {
    if (state === 'hasValue' && Array.isArray(contents)) {
      setMembers(contents);
    }
  }, [state, contents]);

  let title = null;
  if (members) {
    if (members?.length === 1) {
      title = members[0]?.realname || `@${members[0]?.username}`;
    } else if (members?.length > 1) {
      title = dialog.profile.title;
    }
  }
  return (
    <div className="media-body align-self-center text-truncate">
      <h6 className="text-truncate m-0">{title}</h6>
      {members && members.length > 2 && (
        <React.Fragment>
          <small className="text-muted">{members.length} members</small>
          <small className="text-muted mx-2"> • </small>
        </React.Fragment>
      )}
      {dialog.last_message_created_at && (
        <small className="text-muted">
          last message {dayjs().to(new Date(dialog.last_message_created_at))}
        </small>
      )}
    </div>
  );
};
export default Header;
