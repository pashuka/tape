import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import FormRadio from './Radio';
import FormSelect from './Select';

// https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa
// ucs-2 string to base64 encoded ascii
export const utoa = (str) => {
  return window.btoa(unescape(encodeURIComponent(str)));
};

const Form = ({
  pending = false,
  disabled = false,
  history,
  errors = [],
  warning = null,
  schema = {},
  data = {},
  title,
  buttonTitle,
  onSubmit = () => {},
}) => {
  const { t } = useTranslation();

  title = title || t('New record');
  buttonTitle = buttonTitle || t('Save');

  const [values, setValues] = useState({});
  const [valids, setValids] = useState({});
  const onFormChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (schema[name] && typeof schema[name].onChangeBefore === 'function') {
      value = schema[name].onChangeBefore(value);
    } else if (e.target.type === 'file') {
      value = e.target.files[0];
    }

    setValues({ ...values, [name]: value });

    setValids({
      ...valids,
      [name]:
        schema[name] && typeof schema[name].valid === 'function'
          ? schema[name].valid(value, values)
          : undefined,
    });
  };

  const isFormValid = Object.keys(valids).reduce(
    (a, _) => (a = a && valids[_] === undefined ? true : valids[_]),
    true,
  );

  useEffect(() => {
    if (data && Object.keys(data).length) {
      setValids(Object.keys(data).map((_) => ({ [_]: undefined })));
      setValues(
        Object.keys(data).reduce((o, k) => {
          o[k] =
            schema[k] && schema[k].decode ? schema[k].decode(data[k]) : data[k];
          return o;
        }, {}),
      );
    }
    // eslint-disable-next-line
  }, [data]);
  return (
    <form encType="multipart/form-data">
      <div
        className={`card ${warning ? 'border-warning' : ''} ${
          errors.filter((_) => _).length > 0 ? 'border-danger' : ''
        }`}
      >
        <div className="card-header pl-0">
          <h5 className="float-left ml-4 pt-2 pb-0">
            {(data && title) || 'Edit record'}
          </h5>
        </div>
        <div className="card-body">
          {warning && (
            <div className="alert small alert-warning">
              <strong>Warning</strong>
              <br />
              {warning}
            </div>
          )}
          {errors
            .filter((_) => _)
            .map((_, i) => (
              <div key={`form-error-${i}`} className="alert alert-danger">
                {/* <strong>{_.status}</strong> {_.statusText}
                <br /> */}
                {_.body &&
                  _.body.errors &&
                  Array.isArray(_.body.errors) &&
                  _.body.errors.map(({ message }, mi) => (
                    <p className="m-0" key={`form-error-message-${mi}`}>
                      {message}
                    </p>
                  ))}
              </div>
            ))}

          {Object.keys(schema)
            .filter((_) => !schema[_].hidden)
            .map((_) => {
              let inputComponent = null;
              const _disabled = pending || disabled || schema[_].disabled;
              const inputValue = values[_] || '';
              const isValid =
                typeof valids[_] !== 'undefined'
                  ? valids[_]
                    ? 'is-valid'
                    : 'is-invalid'
                  : '';
              const _placeholder = t(schema[_].placeholder || schema[_].label);
              switch (schema[_].type) {
                case 'select':
                  inputComponent = (
                    <FormSelect
                      name={_}
                      className={`form-control ${isValid}`}
                      disabled={_disabled}
                      id={`schema-field-${_}`}
                      value={inputValue}
                      defaultValue={!!schema[_].defaultValue}
                      onChange={onFormChange}
                      options={schema[_].values}
                    />
                  );
                  break;

                case 'radio':
                  inputComponent = (
                    <FormRadio
                      name={_}
                      dBlock={true}
                      disabled={_disabled}
                      id={`schema-field-${_}`}
                      checked={inputValue.toString()}
                      onChange={onFormChange}
                      options={schema[_].values}
                    />
                  );
                  break;

                case 'email':
                case 'password':
                case 'text':
                default:
                  inputComponent = (
                    <input
                      name={_}
                      type={schema[_].type}
                      className={`form-control ${isValid}`}
                      disabled={_disabled}
                      id={`schema-field-${_}`}
                      value={inputValue}
                      placeholder={_placeholder}
                      onChange={onFormChange}
                      {...(schema[_].attributes ? schema[_].attributes : {})}
                    />
                  );
                  break;
              }

              return (
                <div className="form-group" key={`schema-${_}`}>
                  <label htmlFor={`schema-field-${_}`}>
                    {t(schema[_].formLabel || schema[_].label)}
                    {schema[_].required && <sup className="text-danger">*</sup>}
                  </label>
                  {inputComponent}

                  {schema[_].helper && (
                    <small
                      id={`schema-field-${_}`}
                      className="form-text text-muted pl-2"
                    >
                      {t(schema[_].helper)}
                    </small>
                  )}
                </div>
              );
            })}
          <hr />
          <button
            type="submit"
            className="btn btn-primary mr-2"
            disabled={pending || disabled || !isFormValid}
            onClick={(e) => {
              e.preventDefault();
              onSubmit(
                Object.keys(values)
                  .filter((_) => values[_] !== data[_])
                  .reduce((o, k) => {
                    o[k] =
                      schema[k] && schema[k].encode
                        ? schema[k].encode(values[k])
                        : values[k];
                    return o;
                  }, {}),
              );
            }}
          >
            {pending && <span className="spinner-grow spinner-grow-sm"></span>}{' '}
            {buttonTitle}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              history.goBack();
            }}
            className="btn btn-outline-secondary"
          >
            {t('Cancel')}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Form;
