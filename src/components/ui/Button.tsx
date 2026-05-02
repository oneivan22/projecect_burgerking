function Button({ children, onClick, className, type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
