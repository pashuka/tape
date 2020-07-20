import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import INotificationsNoneIcon from '@material-ui/icons/NotificationsNone';

dayjs.extend(relativeTime);

type HeaderType = {
  title: string;
  className?: string;
  dt?: Date;
};

type ToastPropsType = {
  header: HeaderType;
  body: string;
};

const Toast = ({ header, body }: ToastPropsType) => {
  header = Object.assign(
    {
      title: 'Notification',
      className: 'text-secondary',
      dt: new Date(),
    },
    header,
  );
  return (
    <div
      className="toast ml-auto fade show bg-light fixed-top"
      style={{ top: '.75rem', right: '.75rem' }}
    >
      <div className="toast-header">
        <INotificationsNoneIcon className="mr-2 text-gray-400" />
        <strong className={`mr-auto ${header.className}`}>
          {header.title}
        </strong>
        <small className="text-muted">
          {header.dt ? dayjs().to(header.dt) : ''}
        </small>
        <button type="button" className="ml-2 mb-1 close">
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className="toast-body">{body || ''}</div>
    </div>
  );
};

type NotificationsPropsType = {
  toasts: ToastPropsType[];
};

const Notifications = ({ toasts }: NotificationsPropsType) => (
  <div className="position-absolute w-100 d-flex flex-column p-4">
    {toasts?.map((_, i) => (
      <Toast key={i} header={_.header} body={_.body} />
    ))}
  </div>
);

export default Notifications;
