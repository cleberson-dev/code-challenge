import classNames from "classnames";

export default function Pokemon({ pokemon }) {
  const typeColors = {
    normal: '#C3C0B8', fighting: '#80311D',
    flying: '#5D74D5', poison: '#924694',
    ground: '#D0B155', rock: '#9D853C',
    bug: '#89960B', ghost: '#AD6EEC',
    steel: '#8F8E9E', fire: '#EC5D35',
    water: '#5CC1ED', grass: '#68BB2B',
    electric: '#F4CB38', psychic: '#DA3063',
    ice: '#9BDEFB', dragon: '#6B57D2',
    dark: '#322C26', fairy: '#DA93DD',
    unknown: '#C3C0B8', shadow: '#C3C0B8',
  };

  const classes = classNames({
    "flex flex-col items-center w-full relative hover:opacity-80": true,
  });

  return (
    <div className={classes}>
      <div 
        style={{ fontFamily: 'Poppins', fontWeight: 'bold', backgroundColor: '#90ADC6' }} 
        className="text-xs absolute top-0 left-0 text-white rounded-full w-6 h-6 flex flex-row justify-center items-center"
      >
        #{pokemon.id}
      </div>
      <img 
        src={pokemon.sprites.other['official-artwork'].front_default} 
        alt="Image"
        className="mt-4 w-full"
      ></img>
      <div 
        style={{ fontFamily: 'Spartan Bold', color: '#333652' }}
        className="capitalize text-sm truncate text-left overflow-hidden whitespace-nowrap"
      >
        {pokemon.name}
      </div>
      <div className="grid grid-cols-2 w-full" style={{ columnGap: '5px' }}>
        <div
          className="w-full h-1"
          style={{ backgroundColor: typeColors[pokemon.types[0]?.type.name] || 'white' }}
        ></div>
        { pokemon.types[1] && <div
          className="w-full h-1"
          style={{ backgroundColor: typeColors[pokemon.types[1].type.name] || 'white' }}
        ></div> }
      </div>
    </div>
  );
}