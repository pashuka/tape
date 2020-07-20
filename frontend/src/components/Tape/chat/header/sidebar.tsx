import React from "react";

import ISearch from "@material-ui/icons/Search";
import IPersonAdd from "@material-ui/icons/PersonAdd";
import IMoreVert from "@material-ui/icons/MoreVert";

declare type PropsType = {
  isPending: boolean;
};

const SideBar = ({ isPending }: PropsType) => (
  <div className="col-2 col-xl-4 text-right">
    <ul className="nav justify-content-end">
      <li className="nav-item list-inline-item d-none d-xl-block mr-2">
        <button
          className="nav-link btn btn-link text-muted px-3"
          title="Search this chat"
          type="button"
          disabled={isPending}
        >
          <ISearch />
        </button>
      </li>

      <li className="nav-item list-inline-item d-none d-xl-block mr-2">
        <button
          className="nav-link btn btn-link text-muted px-3"
          title="Add People"
          type="button"
          disabled={isPending}
        >
          <IPersonAdd />
        </button>
      </li>

      <li className="nav-item list-inline-item d-none d-xl-block mr-0">
        <button
          type="button"
          disabled={isPending}
          className="nav-link btn btn-link text-muted px-3"
          title="Details"
        >
          <IMoreVert />
        </button>
      </li>

      <li className="nav-item list-inline-item d-block d-xl-none">
        <div className="dropdown">
          <button
            className="nav-link btn btn-link text-muted px-0"
            type="button"
            disabled={isPending}
          >
            <IMoreVert />
          </button>
          <div className="dropdown-menu">
            <a
              className="dropdown-item d-flex align-items-center"
              data-toggle="collapse"
              data-target="#chat-1-search"
              href="#chat-search"
            >
              Search <ISearch />
            </a>

            <a
              className="dropdown-item d-flex align-items-center"
              href="#chat-info"
              data-chat-sidebar-toggle="#chat-1-info"
            >
              Chat Info <span className="ml-auto pl-5 fe-more-horizontal"></span>
            </a>

            <button className="dropdown-item d-flex align-items-center" disabled={isPending}>
              Add Members <IPersonAdd />
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
);
export default SideBar;
