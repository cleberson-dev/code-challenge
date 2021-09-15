import { useEffect, useMemo, useState, useRef } from 'react';
import Button from '../components/Button';
import PokemonSlot from '../components/PokemonSlot';
import confirmIcon from '../../public/confirm-icon.svg';
import removeIcon from '../../public/remove-icon.svg';
import editIcon from '../../public/edit-icon.svg';
import classNames from 'classnames';
import PokemonsList from '../components/PokemonsList';

export default function HomePage() {
  const [pokemons, setPokemons] = useState([]);
  const [pokemonSlots, setPokemonSlots] = useState(new Array(6).fill(null));
  const [pokemonSlotSelected, setPokemonSlotSelected] = useState(null);
  const [teamName, setTeamName] = useState('My Team');
  const [isEditingTeamName, setIsEditingTeamName] = useState(false);
  const teamNameInput = useRef(null);

  const areSlotsAvailable = useMemo(() => pokemonSlots.filter(slot => !slot).length > 0, [pokemonSlots]);

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

  function pokemonClickHandler(pokemon) {
    if (pokemon.added) return removePokemonFromSlot(pokemon);  
    addPokemonToOpenSlot(pokemon); 
  }

  function removePokemonFromSlot(pokemonToBeRemoved) {
    setPokemonSlots(pokemonSlots.map(pokemon => !pokemon || pokemon.id === pokemonToBeRemoved.id ? null : pokemon))
    setPokemons(pokemons.map(pokemon => pokemon.id === pokemonToBeRemoved.id ? ({ ...pokemon, added: false }) : pokemon));
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
            "ml-10": idx === 3,
            'filter grayscale': pokemon && pokemonSlotSelected && pokemonSlotSelected.id !== pokemon.id
          });

          return (
            <div className={pokemonClasses}>
              <PokemonSlot 
                selected={pokemon && pokemonSlotSelected && pokemon.id === pokemonSlotSelected.id} 
                key={idx} 
                onClick={pokemon && (() => setPokemonSlotSelected(pokemon))} 
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
      <PokemonsList onPokemonClick={pokemonClickHandler} />
    </>
  );
}
