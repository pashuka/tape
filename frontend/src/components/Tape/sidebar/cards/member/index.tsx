import React from 'react';
import { useRouteMatch } from 'react-router-dom';

import { ParamsKeyUser, routes, QSParamsType } from '../../../../../constants';
// import CardWrapper from '../wrapper';
import { useRecoilValueLoadable } from 'recoil';
import {
  userInfoQuery,
  instanceOfUser,
  UserType,
} from '../../../../../hooks/recoil/user';
// import Avatar from '../../../components/avatar';
// import Skeleton from '../../../../Skeleton';
import { instanceOfMember } from '../../../../../hooks/recoil/member';
import CardBasic from '../basic';

type PropsType = {
  username: string;
  route: string;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
};

const CardMember = ({
  username,
  route,
  selectable,
  selected,
  onSelect,
}: PropsType) => {
  const { params } = useRouteMatch<QSParamsType>();

  const { state, contents } = useRecoilValueLoadable(
    userInfoQuery({ username, withDialog: true }),
  );
  const [record, setRecord] = React.useState<UserType | undefined>();

  React.useEffect(() => {
    setRecord(
      state === 'hasValue' && instanceOfUser(contents) ? contents : undefined,
    );
  }, [state, contents]);

  return (
    <CardBasic
      active={record && params[ParamsKeyUser] === username}
      to={`/${routes.tape}/${route}/${
        record && instanceOfMember(record)
          ? `${record.dialog_id}`
          : `${ParamsKeyUser}/${username}`
      }`}
      avaSize="md"
      members={record}
      selectable={selectable}
      selected={selected}
      onSelect={onSelect && record ? (e) => onSelect(username) : undefined}
    />

    // <CardWrapper
    //   active={record && params[ParamsKeyUser] === username}
    //   to={`/${routes.tape}/${route}/${
    //     record && instanceOfMember(record)
    //       ? `${record.dialog_id}`
    //       : `${ParamsKeyUser}/${username}`
    //   }`}
    // >
    //   <Avatar
    //     pending={state === 'loading'}
    //     picture={record?.profile?.picture}
    //     size="md"
    //   />

    //   <div className="media-body ml-2 overflow-hidden border-top">
    //     <div className={`d-flex align-items-center py-2 my-2`}>
    //       <h6 className="text-truncate mb-0 mr-auto">
    //         {state === 'loading' ? (
    //           <Skeleton width="128px" />
    //         ) : record ? (
    //           record.realname || <span>@{record.username}</span>
    //         ) : null}
    //       </h6>
    //     </div>
    //   </div>
    // </CardWrapper>
  );
};

export default CardMember;
