import React from 'react';
import Avatar from '../../../components/avatar';
import { useTranslation } from 'react-i18next';

type ParamsType = {
  selected: string[];
};

const CardCreateGroup = ({ selected }: ParamsType) => {
  const { t } = useTranslation();
  const inputRef = React.createRef<HTMLInputElement>();
  const [preloaded, setPreloaded] = React.useState<string | undefined>();
  React.useEffect(() => {
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
              picture={preloaded}
              isDataURL={true}
            />
            <input
              className="custom-file-input position-absolute"
              type="file"
              style={{ width: '48px', height: '48px' }}
              accept="image/jpg,image/png,image/jpeg,image/gif"
              disabled={false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.currentTarget.files && e.currentTarget.files[0]) {
                  // const reader = new FileReader();
                  // reader.onload = (e: ProgressEvent<FileReader>) => {
                  //   if (e.target) {
                  //     setPreloaded(e.target.result);
                  //   }
                  // };
                  // reader.readAsDataURL(e.currentTarget.files[0]);
                  setPreloaded(URL.createObjectURL(e.currentTarget.files[0]));
                }
              }}
              // onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              //   e.preventDefault();
              //   if (
              //     e.target.type === 'file' &&
              //     e.target.files &&
              //     e.target.files[0]
              //   ) {
              //     let body = new FormData();
              //     body.append('file', e.target.files[0]);

              //     run({
              //       resource: getRoute(
              //         `picture/${routes.user}/?username=${iam.username}`,
              //       ),
              //       method: 'PUT',
              //       body,
              //     });
              //   }
              // }}
            />
          </div>
          <div className="media-body ml-2 overflow-hidden border-top">
            <div className="d-flex align-items-center pt-2">
              <div className="input-group">
                <input
                  ref={inputRef}
                  type="text"
                  className="form-control border-0 pl-0 shadow-none"
                  placeholder={t('Type group name...')}
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
    </div>
  );
};

export default CardCreateGroup;
