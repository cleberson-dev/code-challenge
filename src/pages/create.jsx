import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import PokemonsList from '../components/PokemonsList';
import TeamForm from '../components/TeamForm';
import { AppContext } from './_app';

export default function HomePage() {
  const { 
    pokemons, addPokemons, pokemonSlots, clearPokemonSlots, setSelectedSlot
  } = useContext(AppContext);
  const router = useRouter();
  
  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon').then(res => res.json())
      .then(({ results }) => {
        return Promise.all(results.map(pokemon => fetch(pokemon.url).then(res => res.json())));
      })
      .then(loadedPokemons => {
        addPokemons(loadedPokemons);
      });
  }, []);

  function fetchMorePokemons() {
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=${pokemons.length}&limit=20`)
    .then(res => res.json())
    .then(({ results }) => Promise.all(results.map(pokemon => fetch(pokemon.url).then(res => res.json()))))
    .then(newPokemons => {
      addPokemons(newPokemons);
    });
  }

  async function createTeam(teamName) {
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
    
    clearPokemonSlots();
    setSelectedSlot(null);
    router.push('/teams');
  }

  return (
    <>
      <TeamForm
        pokemonSlots={pokemonSlots}
        onSubmit={createTeam}
      />

      <h2 className="mt-10 mb-2" style={{ fontFamily: 'Spartan Bold', color: '#333652' }}>
        Choose 6 Pokémons:
      </h2>
      <PokemonsList 
        next={fetchMorePokemons}
        pokemons={pokemons}
      />
    </>
  );
}
