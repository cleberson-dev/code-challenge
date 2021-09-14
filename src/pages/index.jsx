import { useEffect, useState } from 'react';
import Button from '../components/Button';
import Header from '../components/Header';
import Pokemon from '../components/Pokemon';
import PokemonSlot from '../components/PokemonSlot';
import confirmIcon from '../../public/confirm-icon.svg';
import removeIcon from '../../public/remove-icon.svg';

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
      <Button status="success" icon={confirmIcon.src} />
      <Button status="danger" icon={removeIcon.src} />
      <h2 style={{ fontFamily: 'Spartan Bold', color: '#333652' }} className="text-base">
        My Team
      </h2>
      { pokemons.length > 0 && pokemons[0].loaded && <PokemonSlot pokemon={pokemons[0]} /> }

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
