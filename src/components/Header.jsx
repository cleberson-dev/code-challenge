export default function Header() {
  return (
    <header 
      style={{ backgroundColor: '#90ADC6' }} 
      className="h-44 flex-col justify-center items-center"
    >
      <div style={{ height: '2px' }} className="bg-white w-4/5"></div>
      <h1 
        style={{ fontFamily: 'Spartan Bold' }}
        className="text-white text-xl"
      >
        Teams
      </h1>
    </header>
  );
}