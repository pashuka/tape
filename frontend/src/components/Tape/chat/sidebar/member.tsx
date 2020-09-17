import React from 'react';
import { useRecoilValueLoadable } from 'recoil';
import IMoreVert from '@material-ui/icons/MoreVert';

import {
  instanceOfUser,
  userInfoQuery,
  UserType,
  UserNameType,
} from '../../../../hooks/recoil/user';
import { MemberType, MemberRoleType } from '../../../../hooks/recoil/member';
import Avatar from '../../components/avatar';
import Skeleton from '../../../Skeleton';
// import SubMenu from './submenu';

type PropsType = UserNameType & {
  role: MemberRoleType;
};

const CardMember = ({ username, role }: PropsType) => {
  const { state, contents } = useRecoilValueLoadable(
    userInfoQuery({ username }),
  );
  const [member, setMember] = React.useState<
    UserType | MemberType | undefined
  >();
  React.useEffect(() => {
    if (state === 'hasValue' && instanceOfUser(contents)) {
      setMember(contents);
    }
  }, [state, contents]);

  const title =
    state === 'loading' ? <Skeleton width="128px" /> : member?.realname;

  return (
    <div className="card border-0 rounded-0 card-regular">
      <div className="card-body p-0 px-2">
        <div className="media d-flex align-items-center justify-content-center">
          <Avatar
            pending={state === 'loading'}
            picture={member?.profile?.picture}
            size="sm"
          />

          <div className="media-body ml-2 overflow-hidden border-top">
            <div className="d-flex align-items-center my-2 py-2">
              <h6 className="text-truncate mb-0 mr-auto">{title}</h6>
              <p className="text-muted text-nowrap mb-0">
                <span className="badge badge-sm border mx-2 p-1">{role}</span>
                {/* <SubMenu /> */}
                <button
                  onClick={() => {}}
                  type="button"
                  disabled={true}
                  className="btn btn-link text-muted px-1 mr-1"
                >
                  <IMoreVert />
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardMember;
