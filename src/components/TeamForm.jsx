import { useState, useRef, useEffect, useMemo } from 'react';
import Button from '../components/Button';
import PokemonSlot from '../components/PokemonSlot';
import confirmIcon from '../../public/confirm-icon.svg';
import removeIcon from '../../public/remove-icon.svg';
import editIcon from '../../public/edit-icon.svg';
import classNames from 'classnames';

export default function TeamForm({ pokemonSlots, onSubmit }) {
  const [pokemonSlotSelected, setPokemonSlotSelected] = useState(null);
  const areSlotsAvailable = useMemo(() => pokemonSlots.filter(slot => !slot).length > 0, [pokemonSlots]);
  
  const [teamName, setTeamName] = useState('My Team');
  const [isEditingTeamName, setIsEditingTeamName] = useState(false);
  const teamNameInput = useRef(null);

  useEffect(() => {
    if (!teamNameInput.current) return;
    teamNameInput.current.focus();
  }, [isEditingTeamName]);

  return (
    <form onSubmit={onSubmit}>
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
          type="submit"
          className="mr-2"
        />
        <Button status="danger" icon={removeIcon.src} disabled={!pokemonSlotSelected} onClick={() => {
          removePokemonFromSlot(pokemonSlotSelected);
          setPokemonSlotSelected(null);
        }} />
      </div>
    </form>
  )
}