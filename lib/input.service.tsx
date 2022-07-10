import React from 'react';

// Nice solution from https://blog.logrocket.com/forms-in-react-in-2020/

export function useFormField(initialValue: string = '') {
  // use state returns the reference to the value as well as the method to alter it
  const [value, setValue] = React.useState(initialValue);
  // use custom callback
  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value), []
  );
  return { value, onChange };
};