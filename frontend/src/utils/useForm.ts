import { useState, ChangeEvent } from 'react';

type FormValues = {
  [key: string]: string;
};

type UseFormReturn = [
  FormValues,
  (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  () => void
];

export const useForm = (initialValues: FormValues): UseFormReturn => {
  const [values, setValues] = useState<FormValues>(initialValues);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const resetForm = () => {
    setValues(initialValues);
  };

  return [values, handleChange, resetForm];
};

export default useForm;
