import React from "react";
import { UserType } from "../../../../hooks/recoil/user";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

declare type PropsType = {
  participant?: UserType;
};

const DialogHeader = ({ participant }: PropsType) => (
  <div className="media-body align-self-center text-truncate">
    <h6 className="text-truncate mt-2">{participant?.realname || participant?.username}</h6>
  </div>
);
export default DialogHeader;
