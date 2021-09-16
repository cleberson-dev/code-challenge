import { useState } from "react";

export default function usePokemons() {
  const [pokemons, setPokemons] = useState([]);

  function addPokemons(newPokemons) {
    setPokemons([
      ...pokemons,
      ...newPokemons
    ]);
  }

  return { pokemons, addPokemons };
}