import classNames from "classnames";
import Pokeball from "./Pokeball";

export default function PokemonSlot({ pokemon, onClick, selected = false }) {
  const classes = classNames({
    "relative": true,
    "filter grayscale": selected,
    "cursor-pointer": !!onClick,
    "hover:opacity-80": true
  });

  return (
    <div className={classes} onClick={onClick}>
      <Pokeball type={pokemon?.types[0].type.name} />
      { pokemon && <img
        className="absolute top-0 transform scale-125"
        src={pokemon.sprites.other['official-artwork'].front_default} 
        alt="Image" 
      /> }
    </div>
  );
}