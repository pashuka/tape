import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';
import ICancel from '@material-ui/icons/Cancel';

import { instanceOfUser, userInfoQuery } from '../../../../hooks/recoil/user';
import Avatar, { iconSizeType } from '../../components/avatar';
import { routes } from '../../../../constants';
import Skeleton from '../../../Skeleton';
import CardWrapper from './wrapper';

type PropsType = {
  active?: boolean;
  to?: string;
  avaSize?: iconSizeType;
  username: string;
  isCancelable?: boolean;
};

const CardLoadable = ({
  to,
  active,
  avaSize,
  username,
  isCancelable,
}: PropsType) => {
  const { state, contents } = useRecoilValueLoadable(
    userInfoQuery({ username }),
  );
  return (
    <CardWrapper active={active} to={to || ''}>
      {state === 'loading' && <Skeleton roundedCircle />}
      {state === 'hasValue' && instanceOfUser(contents) && (
        <Avatar
          active={active}
          picture={contents.profile?.picture}
          realname={contents.realname}
          username={contents.username}
          size={avaSize || 'md'}
        />
      )}

      <div className="media-body ml-2 overflow-hidden border-top">
        <div className={`d-flex align-items-center py-2 my-2`}>
          <h6 className="text-truncate mb-0 mr-auto">
            {state === 'loading' && <Skeleton width="128px" />}
            {state === 'hasValue' &&
              instanceOfUser(contents) &&
              (contents?.realname || <span>@{contents?.username}</span>)}
          </h6>
          {isCancelable && (
            <Link
              className="btn btn-link text-gray-400 text-nowrap"
              to={`/${routes.tape}/${routes.dialogs}/`}
            >
              <ICancel />
            </Link>
          )}
        </div>
      </div>
    </CardWrapper>
  );
};

export default CardLoadable;
