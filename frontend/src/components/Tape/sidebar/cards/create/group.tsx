import React from 'react';
import Avatar from '../../../components/avatar';
import { useTranslation } from 'react-i18next';
import { useFetch } from 'react-async';
import {
  DialogType,
  instanceOfDialog,
} from '../../../../../hooks/recoil/dialog';
import { getRoute, routes } from '../../../../../constants';
import { useHistory } from 'react-router-dom';

type ParamsType = {
  selected: string[];
};

type SchemaType = {
  title?: string;
  file?: File;
};

const CardCreateGroup = ({ selected }: ParamsType) => {
  const { t } = useTranslation();
  const history = useHistory();
  const inputRef = React.createRef<HTMLInputElement>();
  const [values, setValues] = React.useState<SchemaType>({});
  const [isValid, setIsValid] = React.useState(false);
  const [preloadedPicture, setPreloadedPicture] = React.useState<
    string | undefined
  >();

  const { data, isPending, run } = useFetch<DialogType>(
    getRoute(`post/${routes.dialogs}/`),
    { headers: { accept: 'application/json' } },
    {
      defer: true,
    },
  );

  React.useEffect(() => {
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (values['file']) {
      setPreloadedPicture(URL.createObjectURL(values['file']));
    } else {
      setPreloadedPicture(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  React.useEffect(() => {
    if (selected.length > 0 && values.title?.length) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, selected]);

  React.useEffect(() => {
    if (!isPending && data && instanceOfDialog(data)) {
      history.push(`/${routes.tape}/${routes.dialogs}/${data.id}/`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isPending]);

  return (
    <div className="card border-0 rounded-0">
      <div className="card-body p-0 px-2">
        <div className="media d-flex align-items-center justify-content-center">
          <div
            className="custom-file group-avatar"
            style={{ width: '48px', height: '48px' }}
          >
            <Avatar
              size="md"
              group={true}
              styles="position-absolute"
              picture={preloadedPicture}
              isDataURL={true}
            />
            <input
              className="custom-file-input position-absolute"
              type="file"
              name="file"
              style={{ width: '48px', height: '48px' }}
              accept="image/jpg,image/png,image/jpeg,image/gif"
              disabled={false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.currentTarget.files && e.currentTarget.files[0]) {
                  setValues({
                    ...values,
                    [e.currentTarget.name]: e.currentTarget.files[0],
                  });
                } else {
                  setValues({
                    ...values,
                    [e.currentTarget.name]: undefined,
                  });
                }
              }}
            />
          </div>
          <div className="media-body ml-2 overflow-hidden border-top">
            <div className="d-flex align-items-center pt-2">
              <div className="input-group">
                <input
                  ref={inputRef}
                  name="title"
                  type="text"
                  className="form-control border-0 pl-0 shadow-none"
                  placeholder={t('Type group name...')}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      [e.currentTarget.name]: e.currentTarget.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="d-flex align-items-center pb-2">
              <div className="small text-muted text-truncate text-left mr-auto">
                <strong>{selected.length}</strong> {t('members selected')}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card border-0 rounded-0">
        <div className="card-body p-0 px-2 pt-2 pb-3">
          <div className="media d-flex align-items-center justify-content-center">
            <button
              disabled={!isValid}
              className="btn btn-primary btn-sm btn-block py-1"
              type="button"
              onClick={() => {
                if (!isValid) {
                  return;
                }
                const body = new FormData();
                for (const key in values) {
                  const value = values[key as keyof SchemaType];
                  if (value) {
                    body.append(key, value);
                  }
                }
                // body.append('members', JSON.stringify(selected));
                selected.forEach((_) => body.append('members[]', _));
                run({
                  resource: getRoute(`post/${routes.dialogs}/`),
                  method: 'POST',
                  body: body,
                });
              }}
            >
              Create group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCreateGroup;
