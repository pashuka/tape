import React from 'react';
import { useTranslation } from 'react-i18next';
import IAdd from '@material-ui/icons/Add';
import IGroupAdd from '@material-ui/icons/GroupAdd';
import ISearch from '@material-ui/icons/Search';
import IClose from '@material-ui/icons/Close';
import IPersonAdd from '@material-ui/icons/PersonAdd';

import useOutsideClick from '../../../hooks/useOutsideClick';
import { useRouteMatch } from 'react-router-dom';
import {
  QSParamsType,
  ParamsKeyUser,
  ParamsKeyDialog,
} from '../../../constants';

type HeaderPropsType = {
  isPending: boolean;
  onChange: (value: string) => void;
};

const Header: React.FC<HeaderPropsType> = ({ isPending, onChange }) => {
  const { t } = useTranslation();
  const [ddRef, isVisible, setIsVisible] = useOutsideClick<HTMLDivElement>(
    false,
  );
  const searchRef = React.createRef<HTMLInputElement>();
  const { params } = useRouteMatch<QSParamsType>();

  const [query, setQuery] = React.useState<string>('');

  React.useEffect(() => {
    onChange(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  React.useEffect(() => {
    if (params[ParamsKeyUser] || params[ParamsKeyDialog]) {
      setQuery('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <div className="dialog-header py-2 py-lg-3 px-2">
      <div className="input-group">
        <div className="input-group-prepend">
          <span
            className={`input-group-text border-0 ${
              isPending ? 'bg-gray-200' : 'bg-white'
            } pr-0`}
          >
            <ISearch className="text-gray-400" />
          </span>
        </div>
        <input
          // disabled={isPending}
          ref={searchRef}
          type="text"
          className="form-control border-0 rounded shadow-none"
          placeholder={t('Search dialogs or users...')}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            // Event fired when the input value is changed
            const value = e.currentTarget.value;
            setQuery(value);
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            // Event fired when the user presses a key down
            // User pressed the enter key, update the input and close the suggestions
            if (13 === e.keyCode && query.length > 0) {
              e.preventDefault();
            }
          }}
          value={query}
        />
        {query.length > 0 && (
          <div className="input-group-append">
            <a
              className="btn btn-link text-body border-0 bg-white"
              href="#clean"
              onClick={(e) => {
                e.preventDefault();
                setQuery('');
              }}
            >
              <IClose fontSize="small" />
            </a>
          </div>
        )}
        <div className="input-group-append dropdown" ref={ddRef}>
          <button
            disabled={isPending}
            className="btn btn-link border-0"
            onClick={() => setIsVisible(!isVisible)}
          >
            <IAdd />
          </button>
          <div
            className={`dropdown-menu dropdown-menu-right border-light ${
              isVisible ? 'show' : ''
            } shadow`}
          >
            <button
              type="button"
              className="dropdown-item d-flex align-items-center"
              onClick={(e) => {
                e.preventDefault();
                searchRef.current?.focus();
                setIsVisible(!isVisible);
              }}
            >
              <IPersonAdd className="mr-3" /> {t('Private chat')}
            </button>
            <button
              type="button"
              disabled
              className="dropdown-item d-flex align-items-center"
              onClick={() => setIsVisible(!isVisible)}
            >
              <IGroupAdd className="mr-3" /> {t('New Group')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
