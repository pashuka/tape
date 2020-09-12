import React from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import SubMenu from './submenu';
import { MessageType } from '../../../../hooks/recoil/message';
import {
  UserNameType,
  userInfoQuery,
  instanceOfUser,
} from '../../../../hooks/recoil/user';
import Avatar from '../../components/avatar';
import { useRecoilValueLoadable } from 'recoil';
import { useTranslation } from 'react-i18next';

dayjs.extend(LocalizedFormat);

type MessageRightPropsType = {
  data: MessageType;
  iam: UserNameType;
};

const MessageRight = ({
  data: { id, created_at, body, updated_at },
  iam: { username },
}: MessageRightPropsType) => {
  const { t } = useTranslation();
  const { state, contents } = useRecoilValueLoadable(
    userInfoQuery({ username }),
  );
  const [isActive, setIsActive] = React.useState(false);
  return (
    <div className="message message-right mt-2 mt-md-3">
      <div className="message-avatar ml-2 ml-lg-4 d-none d-lg-block">
        <Avatar
          pending={state === 'loading'}
          picture={instanceOfUser(contents) ? contents.profile.picture : ''}
          size="sm"
        />
      </div>

      <div className="message-body">
        <div className="message-row">
          <div className="d-flex align-items-end justify-content-end">
            <SubMenu
              message_id={id}
              isIam
              isReplayable={true}
              isEditable={true}
              isDeletable={true}
              handleOpen={setIsActive}
            />

            <div className="message-content">
              <h6 className="text-right text-primary d-none d-md-block">
                {state === 'hasValue' && instanceOfUser(contents)
                  ? contents.realname || <span>@{contents?.username}</span>
                  : '...'}
              </h6>
              <div
                className={`alert alert-primary ${
                  isActive ? 'alert-dark' : ''
                } clearfix mb-0 py-1 px-lg-3 px-2`}
              >
                <div className="float-left text-break">{body}</div>
                <div className="float-right pl-2 pl-md-4 pt-1 small">
                  {updated_at && (
                    <small
                      className="text-gray-600 badge badge-pill"
                      style={{ lineHeight: 1 }}
                      title={dayjs(new Date(updated_at)).format('lll')}
                    >
                      {t('edited')}
                    </small>
                  )}
                  <small
                    className="text-gray-600"
                    style={{ lineHeight: 1 }}
                    title={dayjs(new Date(created_at)).format('lll')}
                  >
                    {dayjs(new Date(created_at)).format('HH:mm')}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageRight;
