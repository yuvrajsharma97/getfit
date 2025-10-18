const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  fullWidth = true,
  className = '',
  ...props
}) => {
  const baseStyles = 'block w-full px-4 py-2.5 text-gray-900 bg-white border rounded-lg transition-smooth placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent';

  const errorStyles = error
    ? 'border-error-500 focus:ring-error-500'
    : 'border-gray-300 hover:border-gray-400';

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <div className={`${widthClass} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {props.required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}

        <input
          className={`${baseStyles} ${errorStyles} ${Icon ? 'pl-10' : ''}`}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-error-500 flex items-center">
          <svg
            className="h-4 w-4 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
