import React from 'react';
import { useTranslation } from 'react-i18next';

type OptionsType = string[] | { [key: string]: string };

type PropsType = {
  defaultValue: boolean;
  options: OptionsType;
};

const FormSelect = ({ options, defaultValue, ...props }: PropsType) => {
  const { t } = useTranslation();
  return (
    <select {...props}>
      {defaultValue && <option value="">{t('<Select value...>')}</option>}
      {Array.isArray(options)
        ? options.map(key => (
            <option key={`option-${key}`} value={key}>
              {key}
            </option>
          ))
        : Object.keys(options).map(key => (
            <option key={`option-${key}`} value={key}>
              {options[key]}
            </option>
          ))}
    </select>
  );
};

export default FormSelect;
