// Component-specific types for KobKlein

export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingProps extends ComponentProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export interface ErrorProps extends ComponentProps {
  message: string;
  retry?: () => void;
  showIcon?: boolean;
}
