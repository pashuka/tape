import React from 'react';

type OptionsType = { [key: string]: string };

type PropsType = {
  name: string;
  checked: string;
  options: OptionsType;
  onChange: () => void;
  dBlock: boolean;
};

const FormRadio = ({ name, checked, options, onChange, dBlock }: PropsType) => {
  return Object.keys(options).map(key => (
    <div
      key={`radio-${name}-${key}`}
      className={`form-check ${dBlock ? '' : 'form-check-inline'}`}
    >
      <input
        className="form-check-input"
        type="radio"
        id={`${name}-${key}`}
        name={name}
        value={key}
        checked={key === checked ? true : false}
        onChange={onChange}
      />
      <label className="form-check-label small" htmlFor={`${name}-${key}`}>
        {options[key]}
      </label>
    </div>
  ));
};

export default FormRadio;
