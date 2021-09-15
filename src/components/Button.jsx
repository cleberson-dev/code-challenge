import classNames from "classnames";

export default function Button({ icon, status, onClick, label = 'Click here', ...props }) {
  const colors = {
    success: '#8FDA58',
    danger: '#F8635A'
  };

  const classes = classNames({
    'flex justify-center items-center': true,
    'rounded-full outline-none border-0 w-12 h-12': true,
    'disabled:opacity-60 disabled:cursor-default': true
  });

  return (
    <button 
      {...props}
      onClick={onClick}
      style={{ backgroundColor: colors[status] || colors.success }} 
      className={`${classes} ${props.className}`}
    >
      <img src={icon} alt={label} />
    </button>
  )
}