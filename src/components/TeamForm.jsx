import { useState, useRef, useEffect, useContext } from 'react';
import classNames from 'classnames';
import Button from '../components/Button';
import PokemonSlot from '../components/PokemonSlot';
import confirmIcon from '../../public/confirm-icon.svg';
import removeIcon from '../../public/remove-icon.svg';
import editIcon from '../../public/edit-icon.svg';
import { AppContext } from '../pages/_app';

export default function TeamForm({ onSubmit }) {
  const { 
    pokemonSlots, addPokemonToOpenSlot, removePokemonFromSlot, 
    selectedSlot, setSelectedSlot,
    availableSlots 
  } = useContext(AppContext);
  
  const [teamName, setTeamName] = useState('My Team');
  const [isEditingTeamName, setIsEditingTeamName] = useState(false);
  const teamNameInput = useRef(null);

  useEffect(() => {
    if (!teamNameInput.current) return;
    teamNameInput.current.focus();
  }, [isEditingTeamName]);

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(teamName);
      setTeamName('My Team');
    }}>
      <h2 
        style={{ fontFamily: 'Spartan Bold', color: '#333652' }} 
        className="text-base flex items-center"
      >
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
        <button className="ml-1" type="button" onClick={() => {
          setIsEditingTeamName(!isEditingTeamName);
        }}>
          <img src={editIcon.src} />
        </button>
      </h2>
      <div className="flex flex-wrap">
        {pokemonSlots.map((pokemon, idx) => {
          const pokemonClasses = classNames({
            'w-1/4 ml-4 mt-4': true,
            "ml-10": idx === 3,
            'filter grayscale': pokemon && selectedSlot && selectedSlot.id !== pokemon.id
          });

          return (
            <div key={idx} className={pokemonClasses}>
              <PokemonSlot
                selected={pokemon && selectedSlot && pokemon.id === selectedSlot.id} 
                onClick={pokemon && (() => setSelectedSlot(pokemon))} 
                pokemon={pokemon}
                slot={idx}
                onPokemonDrop={droppedPokemon => addPokemonToOpenSlot(droppedPokemon)}
              />
            </div>
          );
        })}
      </div>
      <div className="flex flex-row justify-end mt-4">
        <Button 
          status="success" icon={confirmIcon.src} 
          disabled={availableSlots > 0}
          type="submit"
          className="mr-2"
        />
        <Button type="button" status="danger" icon={removeIcon.src} disabled={!selectedSlot} onClick={() => {
          removePokemonFromSlot(selectedSlot);
          setSelectedSlot(null);
        }} />
      </div>
    </form>
  )
}