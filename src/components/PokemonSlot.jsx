import Pokeball from "./Pokeball";

export default function PokemonSlot({ pokemon }) {
  return (
    <div className="relative">
      <Pokeball type={pokemon.types[0].type.name} />
      <img
        className="absolute top-0 transform scale-110"
        src={pokemon.sprites.other['official-artwork'].front_default} 
        alt="Image" 
      />
    </div>
  );
}