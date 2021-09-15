import { useState, useEffect } from 'react';
import PokemonsList from '../components/PokemonsList';
import TeamForm from '../components/TeamForm';

export default function HomePage() {
  const [pokemons, setPokemons] = useState([]);
  const [pokemonSlots, setPokemonSlots] = useState(new Array(6).fill(null));

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon').then(res => res.json())
      .then(({ results }) => {
        return Promise.all(results.map(pokemon => fetch(pokemon.url).then(res => res.json())));
      })
      .then(loadedPokemons => {
        setPokemons(loadedPokemons);
      });
  }, []);

  function fetchMorePokemons() {
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=${pokemons.length}&limit=20`)
    .then(res => res.json())
    .then(({ results }) => Promise.all(results.map(pokemon => fetch(pokemon.url).then(res => res.json()))))
    .then(newPokemons => {
      setPokemons([
        ...pokemons,
        ...newPokemons
      ]);
    });
  }
  function addPokemonToOpenSlot(newPokemon) {
    // It should add into the first available slot
    const newPokemonSlots = [...pokemonSlots];
    for (let i = 0; i < newPokemonSlots.length; i += 1) {
      const pokemon = newPokemonSlots[i];
      if (!pokemon) {
        newPokemonSlots[i] = newPokemon;
        setPokemonSlots(newPokemonSlots);
        setPokemons(pokemons.map(p => p.id === newPokemon.id ? ({ ...newPokemon, added: true }) : p))
        break;
      }
    }
  }

  function removePokemonFromSlot(pokemonToBeRemoved) {
    setPokemonSlots(pokemonSlots.map(pokemon => !pokemon || pokemon.id === pokemonToBeRemoved.id ? null : pokemon))
    setPokemons(pokemons.map(pokemon => pokemon.id === pokemonToBeRemoved.id ? ({ ...pokemon, added: false }) : pokemon));
  }

  function pokemonClickHandler(pokemon) {
    if (pokemon.added) return removePokemonFromSlot(pokemon);  
    addPokemonToOpenSlot(pokemon); 
  }

  async function createTeam() {
    const body = {
      name: teamName,
      pokemons: pokemonSlots.map(slot => ({ id: slot.id }))
    };

    await fetch('/api/teams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    alert('Everything went well!!');
    setPokemonSlots(pokemonSlots.map(() => null));
    setPokemonSlotSelected(null);
    setTeamName('My Team');
    setPokemons(pokemons.map(poke => ({ ...poke, added: false })));
  }

  return (
    <>
      <TeamForm
        pokemonSlots={pokemonSlots}
        onSubmit={createTeam}
      />

      <h2 style={{ fontFamily: 'Spartan Bold', color: '#333652' }}>
        Choose 6 Pokémons:
      </h2>
      <PokemonsList 
        onPokemonClick={pokemonClickHandler}
        next={fetchMorePokemons}
        pokemons={pokemons}
      />
    </>
  );
}
