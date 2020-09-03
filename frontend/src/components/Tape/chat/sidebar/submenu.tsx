import React from 'react';
import useOutsideClick from '../../../../hooks/useOutsideClick';
import IMoreVert from '@material-ui/icons/MoreVert';
import IReply from '@material-ui/icons/Reply';
import IEdit from '@material-ui/icons/Edit';
import IDeleteForever from '@material-ui/icons/DeleteForever';

export type SubMenuPropsType = {
  leftSide?: boolean;
};

const SubMenu = ({ leftSide }: SubMenuPropsType) => {
  const [ref, show, setShow] = useOutsideClick<HTMLDivElement>(false);

  return (
    <div className="d-inline-block dropdown dropup">
      <button
        onClick={() => setShow(!show)}
        type="button"
        className={`btn btn-link text-gray-400 ${
          !!leftSide ? 'mr-1' : 'ml-1'
        } p-1`}
      >
        <IMoreVert />
      </button>

      <div
        className={`dropdown-menu ${
          !!leftSide ? '' : 'dropdown-menu-right'
        } border-light ${show ? 'show' : ''} shadow`}
        ref={ref}
      >
        <button
          type="button"
          disabled
          className="dropdown-item d-flex align-items-center text-gray-400"
          onClick={() => setShow(!show)}
        >
          Reply{' '}
          <span className="ml-auto">
            <IReply />
          </span>
        </button>
        <button
          type="button"
          disabled
          className="dropdown-item d-flex align-items-center"
          onClick={() => setShow(!show)}
        >
          Edit{' '}
          <span className="ml-auto">
            <IEdit />
          </span>
        </button>
        <button
          type="button"
          disabled
          className="dropdown-item d-flex align-items-center"
          onClick={() => setShow(!show)}
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
