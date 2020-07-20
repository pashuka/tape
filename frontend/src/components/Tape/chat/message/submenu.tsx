import React from "react";

import useOutsideClick from "../../../../hooks/useOutsideClick";
import IMoreVert from "@material-ui/icons/MoreVert";

export type SubMenuPropsType = {
  leftSide?: boolean;
};

const SubMenu = ({ leftSide }: SubMenuPropsType) => {
  const [ref, show, setShow] = useOutsideClick<HTMLDivElement>(false);

  return (
    <div className="dropdown">
      <button
        onClick={() => setShow(!show)}
        type="button"
        className={`btn btn-link text-gray-400 ${!!leftSide ? "mr-1" : "ml-1"} p-1 p-lg-2`}
      >
        <IMoreVert />
      </button>

      <div
        className={`dropdown-menu ${!!leftSide ? "" : "dropdown-menu-right"} border-light ${
          show ? "show" : ""
        } shadow`}
        ref={ref}
      >
        <button
          type="button"
          disabled
          className="dropdown-item d-flex align-items-center"
          onClick={() => setShow(!show)}
        >
          Reply <span className="ml-auto fe-share-2"></span>
        </button>
        <button
          type="button"
          disabled
          className="dropdown-item d-flex align-items-center"
          onClick={() => setShow(!show)}
        >
          Edit <span className="ml-auto fe-edit-3"></span>
        </button>
        <button
          type="button"
          disabled
          className="dropdown-item d-flex align-items-center"
          onClick={() => setShow(!show)}
        >
          Delete <span className="ml-auto fe-trash-2"></span>
        </button>
      </div>
    </div>
  );
};

export default SubMenu;
