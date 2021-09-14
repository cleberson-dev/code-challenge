export default function Button({ icon, status, onClick, label = 'Click here' }) {
  const colors = {
    success: '#8FDA58',
    danger: '#F8635A'
  };

  return (
    <button 
      onClick={onClick}
      style={{ backgroundColor: colors[status] || colors.success }} 
      className="rounded-full outline-none border-0 flex justify-center items-center w-12 h-12"
    >
      <img src={icon} alt={label} />
    </button>
  )
}