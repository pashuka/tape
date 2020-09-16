import React from 'react';
import { MessageType } from '../../../../hooks/recoil/message';
import { userInfoQuery, instanceOfUser } from '../../../../hooks/recoil/user';
import { useRecoilValueLoadable } from 'recoil';
import INotInterested from '@material-ui/icons/NotInterested';
import { useTranslation } from 'react-i18next';

type MessageReplyPropsType = {
  reply: MessageType;
};

const MessageReply = ({ reply: { owner, body } }: MessageReplyPropsType) => {
  const { t } = useTranslation();
  const { state, contents } = useRecoilValueLoadable(
    userInfoQuery({ username: owner }),
  );
  return (
    <div className="small border-left border-primary bg-white rounded px-1 px-lg-2 my-1 mx-n1 mx-lg-n2">
      <strong className="d-block">
        {state === 'hasValue' && instanceOfUser(contents)
          ? contents.realname || <span>@{contents?.username}</span>
          : '...'}
      </strong>
      {body === null ? (
        <small className="text-muted">
          <INotInterested style={{ fontSize: '1rem' }} /> <i>{t('deleted')}</i>
        </small>
      ) : (
        body
      )}
    </div>
  );
};

export default MessageReply;
