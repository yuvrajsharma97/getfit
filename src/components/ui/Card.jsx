const Card = ({
  children,
  padding = 'md',
  hover = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'bg-white rounded-xl border border-gray-200 transition-smooth';

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverStyles = hover ? 'card-elevation cursor-pointer' : 'shadow-card';

  return (
    <div
      className={`${baseStyles} ${paddingStyles[padding]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
