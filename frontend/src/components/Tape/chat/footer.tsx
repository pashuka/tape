import React from 'react';
import ISend from '@material-ui/icons/Send';
import { useFetch } from 'react-async';
import {
  QSParamsType,
  ParamsKeyUser,
  ParamsKeyDialog,
  host,
  apis,
  routes,
} from '../../../constants';
import { useRouteMatch } from 'react-router-dom';
import { MessageType, messagesState } from '../../../hooks/recoil/message';
import { useResetRecoilState } from 'recoil';
import { DialogsState } from '../../../hooks/recoil/dialog';

const Footer = () => {
  const { params } = useRouteMatch<QSParamsType>();
  const [message, setMessage] = React.useState<string>('');
  const [isShiftEnter, setIsShiftEnter] = React.useState(false);

  const resetMessage = useResetRecoilState(messagesState);
  const resetDialogs = useResetRecoilState(DialogsState);

  const { data, isPending, run: sendMessage } = useFetch<MessageType>(
    `${host}/${apis.version}/post/${routes.messages}/`,
    {
      headers: { accept: 'application/json' },
    },
    { defer: true },
  );
  React.useEffect(() => {
    if (!isPending && data) {
      resetMessage();
      resetDialogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isPending]);

  // Event fired when the input value is changed
  const onChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const value = e.currentTarget.value;
    setMessage(value);
  };

  // Event fired when the user presses a key up
  const onKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // on shift key up
    if (16 === e.keyCode) {
      setIsShiftEnter(false);
    }
  };

  // Event fired when the user presses a key down
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // User pressed the enter key, update the input and close the suggestions
    if (!isShiftEnter && 13 === e.keyCode && message.length > 0) {
      e.preventDefault();
      onSubmitHandler(message);
      // on shift key down, just fix this event
    } else if (16 === e.keyCode) {
      setIsShiftEnter(true);
    }
  };
  const onSubmitHandler = (text: string) => {
    sendMessage({
      method: 'POST',
      body: JSON.stringify(
        params[ParamsKeyUser]
          ? {
              username: params[ParamsKeyUser],
              message: text,
            }
          : { dialog_id: params[ParamsKeyDialog], message },
      ),
    });
    setMessage('');
  };

  const ref = React.createRef<HTMLTextAreaElement>();

  // The second argument is an array of values (usually props).
  // When it's an empty list, the callback will only be fired once, similar to componentDidMount.
  React.useEffect(() => {
    ref.current?.focus();
    // eslint-disable-next-line
  }, [ref]);

  return (
    <div className="chat-footer bg-light py-2 py-lg-3 px-2 px-lg-4">
      <div className="container-xxl">
        <div className="form-row align-items-center">
          <div className="col">
            <div className="input-group">
              {/* Emoji */}
              <div className="input-group-prepend">
                <button
                  className="btn btn-secondary bg-light text-muted border-0"
                  type="button"
                  disabled
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className=""
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                </button>
              </div>
              {/* Textarea */}
              <textarea
                ref={ref}
                disabled={isPending}
                onChange={onChange}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
                className="form-control bg-light border-0 rounded bg-white chat-input"
                placeholder="Type your message"
                rows={1}
                value={message}
                style={{
                  overflow: 'hidden',
                  overflowWrap: 'break-word',
                  resize: 'none',
                }}
              ></textarea>
              <div className="input-group-append">
                <button
                  onClick={(e) => {
                    onSubmitHandler(message);
                  }}
                  disabled={isPending || message.length === 0}
                  className="btn btn-secondary text-primary bg-light border-0"
                  type="button"
                >
                  <ISend />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
