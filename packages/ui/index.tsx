interface ButtonProps {
  appName?: string;
  className?: string;
  children: React.ReactNode;
}

export const Button = ({ children, className }: ButtonProps) => {
  return (
    <button className={className} type="button">
      {children}
    </button>
  );
};
