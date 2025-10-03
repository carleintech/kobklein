// Form-specific types for KobKlein

export interface FormProps {
  onSubmit: (data: any) => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

export interface FieldProps {
  name: string;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}
