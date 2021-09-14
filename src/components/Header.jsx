export default function Header() {
  return (
    <header 
      style={{ backgroundColor: '#90ADC6' }} 
      className="h-44 flex flex-col justify-end items-center py-2"
    >
      <div className="bg-white w-4/5 h-1 mb-2"></div>
      <h1 
        style={{ fontFamily: 'Spartan ExtraBold' }}
        className="text-white text-xl uppercase"
      >
        <a>Teams</a>
      </h1>
    </header>
  );
}