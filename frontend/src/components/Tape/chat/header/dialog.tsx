import React from "react";
import { UserType } from "../../../../hooks/recoil/user";
import { DialogType } from "../../../../hooks/recoil/dialog";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

declare type PropsType = {
  participant?: UserType;
  dialog: DialogType;
};

const Header = ({ participant, dialog }: PropsType) => (
  <div className="media-body align-self-center text-truncate">
    <h6 className="text-truncate m-0">{participant?.realname || participant?.username}</h6>
    {dialog.participants.length > 2 && (
      <small className="text-muted">{dialog.participants.length} members</small>
    )}
    {dialog.participants.length > 2 && <small className="text-muted mx-2"> • </small>}
    {dialog.last_message_created_at && (
      <small className="text-muted">
        last message {dayjs().to(new Date(dialog.last_message_created_at))}
      </small>
    )}
  </div>
);
export default Header;
