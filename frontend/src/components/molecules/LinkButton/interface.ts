export interface LinkButtonProps {
  href: string;
  variant?: 'text' | 'outlined' | 'contained' | undefined;
  color?: 'inherit' | 'primary' | 'secondary' | 'default' | undefined;
  type?: 'button' | 'submit' | 'reset' | undefined;
  disabled?: boolean;
}
