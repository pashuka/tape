import React from 'react';

type PropsType = {
  title: string;
  body: string | React.ReactNode;
  isClosed?: boolean;
  buttons?: React.ReactNode[];
};

const Modal = ({ title, body, isClosed, buttons }: PropsType) => (
  <div className="modal fade show d-block" tabIndex={-1} role="dialog">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content border-0 shadow shadow-sm">
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
          {isClosed && (
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          )}
        </div>
        <div className="modal-body">{body}</div>
        <div className="modal-footer">{buttons?.map((_) => _)}</div>
      </div>
    </div>
  </div>
);

export default Modal;
