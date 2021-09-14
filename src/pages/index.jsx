import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Pokemon from '../components/Pokemon';

export default function HomePage() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon').then(res => res.json())
      .then(({ results }) => {
        setPokemons(results.map(pokemon => ({ ...pokemon, loaded: false })));
        return Promise.all(results.map(pokemon => fetch(pokemon.url).then(res => res.json())));
      })
      .then(pokemons => {
        setPokemons(pokemons.map(poke => ({ ...poke, loaded: true })));
      });
  }, []);
  
  return (
    <div>
      <Header />
      <h2 style={{ fontFamily: 'Spartan Bold', color: '#333652' }} className="text-base">
        My Team
      </h2>

      <h2 style={{ fontFamily: 'Spartan Bold', color: '#333652' }} className="text-base">
        Choose 6 Pokémons:
      </h2>
      { pokemons.length > 0 && (
        <div className="grid grid-cols-4" style={{ columnGap: '1rem', rowGap: '1rem' }}>
          {pokemons.map(pokemon => (
            pokemon.loaded ? <Pokemon key={pokemon.name} pokemon={pokemon} /> : <div key={pokemon.name}>{pokemon.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
