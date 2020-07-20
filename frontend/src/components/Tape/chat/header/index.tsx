import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import IPerson from "@material-ui/icons/Person";
import IChevronLeft from "@material-ui/icons/ChevronLeft";
import { useRecoilState } from "recoil";

import { Link } from "react-router-dom";
import { routes } from "../../../../constants";
import Skeleton from "../../../Skeleton";
import { DialogsAtom, DialogType } from "../../../../hooks/recoil/dialog";
import { MessengerAtom } from "../../../../hooks/recoil/messenger";
import { UsersAtom, UserType } from "../../../../hooks/recoil/user";
import DialogHeader from "./dialog";
import UserHeader from "./user";
import SideBar from "./sidebar";

dayjs.extend(relativeTime);

declare type HeaderPropsType = {
  dialog?: DialogType;
  iam: UserType;
  user?: string;
};

// TODO: split dialog header into user/group headers
const Header = ({ dialog, iam, user }: HeaderPropsType) => {
  const [{ isPending: isPendingUsers, data: users }] = useRecoilState(UsersAtom);
  const [messenger, setMessenger] = useRecoilState(MessengerAtom);
  const [{ isPending }] = useRecoilState(DialogsAtom);

  const [participant, setParticipant] = React.useState<UserType | undefined>();

  React.useEffect(() => {
    if (users) {
      let participantUserName: string | undefined;
      if (user) {
        participantUserName = user;
      } else if (dialog) {
        participantUserName = dialog?.participants.find((_) => _ !== iam?.username);
      }
      const record = users.find(({ username }) => username === participantUserName);
      if (record) {
        setParticipant(record);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog, users, user]);

  return (
    <div className="chat-header bg-light py-2 py-lg-3 px-2 px-lg-4">
      <div className="container-xxl">
        <div className="row align-items-center">
          <div className="col-2 d-xl-none">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <Link
                  to={`/${routes.dialogs}/`}
                  className="text-muted px-0"
                  onClick={(e) => {
                    // e.preventDefault();
                    setMessenger({ isOpen: messenger.isOpen, isChatOpen: false });
                  }}
                >
                  <IChevronLeft />
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-8 col-xl-8">
            <div className="media text-center text-xl-left">
              <div className="avatar avatar-sm d-none d-xl-inline-block mr-3 text-center">
                {isPending || isPendingUsers ? (
                  <Skeleton rounded />
                ) : participant?.profile?.picture ? (
                  <img
                    className="avatar-img"
                    src={`${process.env.REACT_APP_IMG_HOST}/${routes.user}/thumb-${participant.profile.picture}`}
                    alt="Participant"
                  />
                ) : (
                  <IPerson fontSize="large" className="m-1 text-white" />
                )}
              </div>
              {isPending ||
                (isPendingUsers && (
                  <div className="media-body align-self-center text-truncate">
                    <h6 className="mb-1">
                      <Skeleton width="128px" />
                    </h6>
                    <small>
                      <Skeleton width="256px" />
                    </small>
                  </div>
                ))}
              {user ? (
                <UserHeader participant={participant} />
              ) : (
                dialog && <DialogHeader dialog={dialog} participant={participant} />
              )}
            </div>
          </div>
          <SideBar isPending={isPending || isPendingUsers || true} />
        </div>
      </div>
    </div>
  );
};

export default Header;
