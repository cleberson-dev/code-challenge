import Pokeball from "./Pokeball";

export default function PokemonSlot({ pokemon, onClick }) {
  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      <Pokeball type={pokemon?.types[0].type.name} />
      { pokemon && <img
        className="absolute top-0 transform scale-110"
        src={pokemon.sprites.other['official-artwork'].front_default} 
        alt="Image" 
      /> }
    </div>
  );
}