import React from 'react';
import ISend from '@material-ui/icons/Send';
import ISentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import ICloseOutlined from '@material-ui/icons/CloseOutlined';
import IFormatQuote from '@material-ui/icons/FormatQuote';
import { useFetch } from 'react-async';
import {
  QSParamsType,
  ParamsKeyUser,
  ParamsKeyDialog,
  routes,
  getRoute,
} from '../../../constants';
import { useRouteMatch, useHistory, useLocation } from 'react-router-dom';
import {
  MessageType,
  messageById,
  instanceOfMessage,
} from '../../../hooks/recoil/message';
import { useRecoilValueLoadable } from 'recoil';

const Footer = () => {
  const history = useHistory();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const { params } = useRouteMatch<QSParamsType>();
  const [message, setMessage] = React.useState<string>('');
  const [messageToAction, setMessageToAction] = React.useState<
    MessageType | undefined
  >();
  const [isShiftEnter, setIsShiftEnter] = React.useState(false);

  const { state, contents } = useRecoilValueLoadable(
    messageById(Number(searchParams.get('id'))),
  );
  React.useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'edit') {
      setMessage(instanceOfMessage(contents) ? contents.body : '');
    }
    setMessageToAction(instanceOfMessage(contents) ? contents : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, state, contents]);

  const { data, isPending, run: sendMessage } = useFetch<MessageType>(
    getRoute(`post/${routes.messages}/`),
    {
      headers: { accept: 'application/json' },
    },
    { defer: true },
  );
  React.useEffect(() => {
    if (!isPending && data) {
      if (params[ParamsKeyUser]) {
        history.push(`/${routes.tape}/${routes.dialogs}/${data.dialog_id}/`);
      } else {
        history.push({ pathname: '', search: '' });
      }
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
    let method = 'POST';
    let resource = getRoute(`post/${routes.messages}/`);

    const action = searchParams.get('action');
    if (action === 'edit' && messageToAction) {
      method = 'PUT';
      resource = getRoute(`put/${routes.messages}/?id=${messageToAction.id}`);
    }

    let body = params[ParamsKeyUser]
      ? {
          username: params[ParamsKeyUser],
          message: text,
        }
      : {
          dialog_id: params[ParamsKeyDialog],
          message,
          reply_id: action === 'reply' ? searchParams.get('id') : null,
        };
    sendMessage({
      resource,
      method,
      body: JSON.stringify(body),
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
      {messageToAction ? (
        <div className="input-group pb-2">
          <div className="input-group-prepend py-2 text-success">
            <IFormatQuote />
          </div>
          <div className="form-control text-truncate bg-transparent border-0">
            {messageToAction.body}
          </div>
          <div className="input-group-append">
            <button
              className="btn btn-link py-0"
              type="button"
              onClick={() => {
                history.push({ pathname: '', search: '' });
              }}
            >
              <ICloseOutlined />
            </button>
          </div>
        </div>
      ) : null}
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
                <ISentimentSatisfiedOutlinedIcon />
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
  );
};

export default Footer;
