import React from 'react';
import IPerson from '@material-ui/icons/Person';
import ICancel from '@material-ui/icons/Cancel';
import { useRecoilState } from 'recoil';
import { Link } from 'react-router-dom';

import { routes, apis, host } from '../../../../constants';
import { useFetch } from 'react-async';
import { UsersAtom, UserType } from '../../../../hooks/recoil/user';

type PropsType = {
  username: string;
};

const CardNew = ({ username }: PropsType) => {
  const isOnline = false;
  const [participant, setParticipant] = React.useState<UserType | undefined>();
  const [{ data: users }, setUsers] = useRecoilState(UsersAtom);

  const { data, run } = useFetch<UserType>(
    `${host}/${apis.version}/get/${routes.user}/?username=`,
    { headers: { accept: 'application/json' } },
    { defer: true },
  );

  React.useEffect(() => {
    if (username.length) {
      const record = users?.find((_) => username === _.username);
      if (record) {
        setParticipant(record);
      } else {
        run({
          resource: `${host}/${apis.version}/get/${routes.user}/?username=${username}`,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (data && data.username === username) {
      setUsers((prev) =>
        prev.data ? { ...prev, data: [...prev.data, data] } : prev,
      );
      setParticipant(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="nav-link text-body p-0">
      <div className="card border-0 rounded-0 alert-primary">
        <div className="card-body py-2 py-lg-2">
          <div className="media">
            <div
              className={`avatar ${
                isOnline ? 'avatar-online' : ''
              } mt-2 mb-2 mr-3`}
            >
              {participant?.profile?.picture ? (
                <img
                  className="avatar-img"
                  src={`${process.env.REACT_APP_IMG_HOST}/${routes.user}/thumb-${participant?.profile?.picture}`}
                  alt={participant?.realname || participant?.username}
                />
              ) : (
                <IPerson fontSize="large" className="ml-2 mt-2 text-white" />
              )}
            </div>

            <div className="media-body overflow-hidden">
              <div className="d-flex align-items-center mt-2 pt-1">
                <h6 className="text-truncate mb-0 mr-auto">
                  {participant?.realname || participant?.username}
                </h6>
                <Link
                  className="btn btn-link text-gray-400 text-nowrap"
                  to={`/${routes.dialogs}/`}
                >
                  <ICancel className="" />
                </Link>
              </div>
              {/* <div className="text-gray-100 text-truncate text-left">...</div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardNew;
