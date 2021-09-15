import PokemonSlot from './PokemonSlot';

export default function Team({ name, pokemons }) {
  console.log({ name, pokemons });
  return (
    <div>
      <div style={{ fontFamily: 'Spartan SemiBold' }}>
        { name }
      </div>
      <div className="p-8 grid grid-cols-3">
        { pokemons.map(pokemon => <PokemonSlot key={pokemon.id} pokemon={pokemon} />) }
      </div>
    </div>
  );
}