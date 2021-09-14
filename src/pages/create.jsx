import { useEffect, useState } from 'react';
import Button from '../components/Button';
import Header from '../components/Header';
import Pokemon from '../components/Pokemon';
import PokemonSlot from '../components/PokemonSlot';
import confirmIcon from '../../public/confirm-icon.svg';
import removeIcon from '../../public/remove-icon.svg';
import classNames from 'classnames';

export default function HomePage() {
  const [pokemons, setPokemons] = useState([]);
  const [pokemonSlots, setPokemonSlots] = useState(new Array(6).fill(null));

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


  function addPokemonToOpenSlot(newPokemon) {
    // It must add to the first open slot found
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
  
  return (
    <div>
      <Header />
      
      <h2 style={{ fontFamily: 'Spartan Bold', color: '#333652' }} className="text-base">
        My Team
      </h2>
      <div className="grid grid-cols-3" style={{ columnGap: '1rem', rowGap: '1rem' }}>
        {pokemonSlots.map((pokemon, idx) => <PokemonSlot key={idx} onClick={() => pokemon && removePokemonFromSlot(pokemon)} pokemon={pokemon} />)}
      </div>
      <div className="flex flex-row justify-end">
        <Button status="success" icon={confirmIcon.src} />
        <Button status="danger" icon={removeIcon.src} />
      </div>



      <h2 style={{ fontFamily: 'Spartan Bold', color: '#333652' }} className="text-base">
        Choose 6 Pokémons:
      </h2>
      { pokemons.length > 0 && (
        <div className="grid grid-cols-4" style={{ columnGap: '1rem', rowGap: '1rem' }}>
          {pokemons.map(pokemon => {
            const pokemonClasses = classNames({
              'relative': true,
              'cursor-pointer': pokemonSlots.some(p => p && p.id === pokemon.id) || pokemonSlots.filter(slot => !slot).length > 0
            });
            return pokemon.loaded ? (
              <div key={pokemon.id} className={pokemonClasses} onClick={() => !pokemon.added ? addPokemonToOpenSlot(pokemon) : removePokemonFromSlot(pokemon)}>
                <Pokemon pokemon={pokemon} /> 
                { pokemon.added && (
                  <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                    <div 
                      style={{ backgroundColor: '#8FDA58' }}
                      className="w-16 h-16 flex justify-center items-center rounded-full opacity-90">
                      <img
                        className="transform scale-150" 
                        src={confirmIcon.src} 
                      />
                    </div>
                  </div>
                ) }
              </div>
            ) : <div key={pokemon.name}>{pokemon.name}</div>
          })}
        </div>
      )}
    </div>
  );
}
