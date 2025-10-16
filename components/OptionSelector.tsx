import React from 'react';
import type { SelectOption } from '../types';

interface OptionSelectorProps<T extends string | number> {
  title: string;
  options: SelectOption<T>[];
  selectedValue: T;
  onValueChange: (value: T) => void;
  disabled?: boolean;
}

const OptionSelector = <T extends string | number,>({
  title,
  options,
  selectedValue,
  onValueChange,
  disabled = false,
}: OptionSelectorProps<T>) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    // The select value is always a string, so we find the original option
    // to check its type. If it was a number, we convert the string back to a number.
    const originalOption = options.find(opt => String(opt.value) === value);
    if (originalOption && typeof originalOption.value === 'number') {
      onValueChange(Number(value) as T);
    } else {
      onValueChange(value as T);
    }
  };

  const id = title.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="w-full">
      <label htmlFor={id} className={`block text-lg font-semibold mb-2 text-gray-800 ${disabled ? 'opacity-50' : ''}`}>{title}</label>
      <div className="relative">
        <select
          id={id}
          value={selectedValue}
          onChange={handleChange}
          disabled={disabled}
          className={`w-full appearance-none bg-white border border-gray-300 text-gray-900 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-gray-50 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/50 transition-colors ${disabled ? 'opacity-50 bg-gray-100 cursor-not-allowed' : ''}`}
        >
          {options.map((option) => (
            <option key={String(option.value)} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default OptionSelector;