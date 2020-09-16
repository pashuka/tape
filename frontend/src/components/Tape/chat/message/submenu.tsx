import React from 'react';
import useOutsideClick from '../../../../hooks/useOutsideClick';
import IMoreVert from '@material-ui/icons/MoreVert';
import IReply from '@material-ui/icons/ReplyOutlined';
import IEdit from '@material-ui/icons/EditOutlined';
import IDeleteForever from '@material-ui/icons/DeleteForeverOutlined';
import { useFetch } from 'react-async';
import { routes, getRoute } from '../../../../constants';
import { idType } from '../../../../types';
import { useHistory } from 'react-router-dom';

export type SubMenuPropsType = {
  message_id: idType;
  handleOpen: (isOpen: boolean) => void;
  isIam?: boolean;
  isReplayable?: boolean;
  isEditable?: boolean;
  isDeletable?: boolean;
};

type ResultType = {
  ok: 'success';
};

const SubMenu = ({
  message_id,
  handleOpen,
  isIam,
  isReplayable,
  isEditable,
  isDeletable,
}: SubMenuPropsType) => {
  const history = useHistory();
  const [ref, show, setShow] = useOutsideClick<HTMLDivElement>(false);

  const { run: runAction } = useFetch<ResultType>(
    getRoute(`method/${routes.dialogs}/`),
    {
      headers: { accept: 'application/json' },
    },
    { defer: true },
  );

  React.useEffect(() => {
    handleOpen(show);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return (
    <div className="dropdown dropup">
      <button
        onClick={() => setShow(!show)}
        type="button"
        className={`btn btn-link text-gray-400 ${isIam ? 'mr-1' : 'ml-1'} p-1`}
      >
        <IMoreVert />
      </button>

      <div
        ref={ref}
        className={`dropdown-menu py-1 ${
          isIam ? '' : 'dropdown-menu-right'
        } border-light ${show ? 'show' : ''} shadow`}
        style={{ minWidth: '6.5rem' }}
      >
        <button
          type="button"
          disabled={!isReplayable}
          className="dropdown-item d-flex px-2 align-items-center"
          onClick={() => {
            setShow(!show);
            history.push({
              pathname: '',
              search: `?action=reply&id=${message_id}`,
            });
          }}
        >
          Reply{' '}
          <span className="ml-auto">
            <IReply />
          </span>
        </button>
        <button
          type="button"
          disabled={!isEditable}
          className="dropdown-item d-flex px-2 align-items-center"
          onClick={() => {
            setShow(!show);
            history.push({
              pathname: '',
              search: `?action=edit&id=${message_id}`,
            });
          }}
        >
          Edit{' '}
          <span className="ml-auto">
            <IEdit />
          </span>
        </button>
        <button
          type="button"
          disabled={!isDeletable}
          className="dropdown-item d-flex px-2 align-items-center"
          onClick={(e) => {
            setShow(!show);
            if (window.confirm('Delete forever?')) {
              runAction({
                resource: getRoute(`${routes.messages}/?id=${message_id}`),
                method: 'DELETE',
              });
            }
          }}
        >
          Delete{' '}
          <span className="ml-auto">
            <IDeleteForever />
          </span>
        </button>
      </div>
    </div>
  );
};

export default SubMenu;
