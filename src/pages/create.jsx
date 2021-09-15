import { useEffect, useMemo, useState, useRef } from 'react';
import Button from '../components/Button';
import Header from '../components/Header';
import Pokemon from '../components/Pokemon';
import PokemonSlot from '../components/PokemonSlot';
import confirmIcon from '../../public/confirm-icon.svg';
import removeIcon from '../../public/remove-icon.svg';
import editIcon from '../../public/edit-icon.svg';
import classNames from 'classnames';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function HomePage() {
  const [pokemons, setPokemons] = useState([]);
  const [pokemonSlots, setPokemonSlots] = useState(new Array(6).fill(null));
  const [pokemonSlotSelected, setPokemonSlotSelected] = useState(null);
  const [teamName, setTeamName] = useState('My Team');
  const [isEditingTeamName, setIsEditingTeamName] = useState(false);
  const teamNameInput = useRef(null);

  const areSlotsAvailable = useMemo(() => pokemonSlots.filter(slot => !slot).length > 0, [pokemonSlots]);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon').then(res => res.json())
      .then(({ results }) => {
        return Promise.all(results.map(pokemon => fetch(pokemon.url).then(res => res.json())));
      })
      .then(loadedPokemons => {
        setPokemons(loadedPokemons);
      });
  }, []);

  useEffect(() => {
    if (!teamNameInput.current) return;
    teamNameInput.current.focus();
  }, [isEditingTeamName]);

  async function createTeam() {
    const body = {
      name: teamName,
      pokemons: pokemonSlots.map(slot => ({ id: slot.id }))
    };

    console.log('Sending: ', body);

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
  
  return (
    <>
      <h2 style={{ fontFamily: 'Spartan Bold', color: '#333652' }} className="text-base flex items-center">
        {
          isEditingTeamName ?  
            <input
              ref={teamNameInput} 
              style={{ width: 'min-content' }}
              value={teamName} 
              onChange={e => setTeamName(e.target.value)} 
              onKeyDown={e => e.code === 'Enter' && setIsEditingTeamName(false)}
            />
            : <span>{ teamName }</span> 
        }
        <button className="ml-1" onClick={() => {
          setIsEditingTeamName(!isEditingTeamName);
        }}>
          <img src={editIcon.src} />
        </button>
      </h2>
      <div className="flex flex-wrap">
        {pokemonSlots.map((pokemon, idx) => {
          const pokemonClasses = classNames({
            'w-1/4 ml-4 mt-2': true,
            "ml-10": idx === 3
          });

          return (
            <div className={pokemonClasses}>
              <PokemonSlot 
                selected={pokemon && pokemonSlotSelected && pokemon.id === pokemonSlotSelected.id} 
                key={idx} 
                onClick={() => pokemon && setPokemonSlotSelected(pokemon)} 
                pokemon={pokemon} 
              />
            </div>
          );
        })}
      </div>
      <div className="flex flex-row justify-end mt-4">
        <Button 
          status="success" icon={confirmIcon.src} 
          disabled={areSlotsAvailable} 
          onClick={() => createTeam()}
          className="mr-2"
        />
        <Button status="danger" icon={removeIcon.src} disabled={!pokemonSlotSelected} onClick={() => {
          removePokemonFromSlot(pokemonSlotSelected);
          setPokemonSlotSelected(null);
        }} />
      </div>



      <h2 style={{ fontFamily: 'Spartan Bold', color: '#333652' }} className="text-base">
        Choose 6 Pokémons:
      </h2>

      <InfiniteScroll
        dataLength={pokemons.length}
        next={fetchMorePokemons}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        { pokemons.length > 0 && (
            <div className="grid grid-cols-4" style={{ columnGap: '1rem', rowGap: '1rem' }}>
              {pokemons.map(pokemon => {
                const pokemonClasses = classNames({
                  'relative': true,
                  'cursor-pointer': pokemonSlots.some(p => p && p.id === pokemon.id) || pokemonSlots.filter(slot => !slot).length > 0
                });
                return (
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
                );
              })}
            </div>
          )}
      </InfiniteScroll>
    </>
  );
}
