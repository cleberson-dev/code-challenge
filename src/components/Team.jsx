import PokemonSlot from './PokemonSlot';

export default function Team({ name, pokemons }) {
  return (
    <div>
      <div style={{ fontFamily: 'Spartan ExtraBold', color: '#333652' }} className="text-lg">
        { name }
      </div>
      <div className="p-4 grid grid-cols-3" style={{ columnGap: '1rem', rowGap: '1rem' }}>
        { pokemons.map(pokemon => <PokemonSlot key={pokemon.id} pokemon={pokemon} />) }
      </div>
    </div>
  );
}