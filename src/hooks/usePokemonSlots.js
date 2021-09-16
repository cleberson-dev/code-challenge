import { useMemo, useState } from "react"

export default function usePokemonSlots() {
  const [pokemonSlots, setPokemonSlots] = useState(new Array(6).fill(null));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const availableSlots = useMemo(() => pokemonSlots.filter(slot => !slot).length);

  // It should be added into the first available slot
  function addPokemonToOpenSlot(newPokemon) {
    const newPokemonSlots = [...pokemonSlots];
    for (let i = 0; i < newPokemonSlots.length; i += 1) {
      const pokemon = newPokemonSlots[i];
      if (pokemon) continue;
      
      newPokemonSlots[i] = newPokemon;
      setPokemonSlots(newPokemonSlots);
      break;
    }
  }

  function removePokemonFromSlot(pokemonToBeRemoved) {
    setPokemonSlots(pokemonSlots.map(pokemon => !pokemon || pokemon.id === pokemonToBeRemoved.id ? null : pokemon));
  }

  function clearPokemonSlots() {
    setPokemonSlots(pokemonSlots.map(() => null));
  }

  function isPokemonAddedToSlot(pokemon) {
    return pokemonSlots.some(slot => slot && slot.id === pokemon.id);
  }

  return { 
    pokemonSlots, availableSlots, selectedSlot,
    addPokemonToOpenSlot, removePokemonFromSlot,
    clearPokemonSlots, setSelectedSlot, isPokemonAddedToSlot
  };
}