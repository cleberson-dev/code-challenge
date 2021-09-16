import { useContext, useMemo } from 'react';
import classNames from 'classnames';
import Pokemon from './Pokemon';
import InfiniteScroll from 'react-infinite-scroll-component';
import confirmIcon from '../../public/confirm-icon.svg';
import { AppContext } from '../pages/_app';
import { css } from '@emotion/css';

export default function PokemonsList({ pokemons, next }) {
  const { isPokemonAddedToSlot, availableSlots, removePokemonFromSlot, addPokemonToOpenSlot } = useContext(AppContext);
  
  const addedIndicatorElement = useMemo(() => (
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
      <div 
        style={{ backgroundColor: '#8FDA58' }}
        className="w-10 h-10 flex justify-center items-center rounded-full opacity-90">
        <img
          className="transform scale-125" 
          src={confirmIcon.src} 
        />
      </div>
    </div>), []);
  
  function pokemonClickHandler(pokemon) {
    if (isPokemonAddedToSlot(pokemon)) return removePokemonFromSlot(pokemon);
    addPokemonToOpenSlot(pokemon); 
  }

  const classes = `${css`
    &::-webkit-scrollbar {
      background-color: transparent;
      width: 5px;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: #C4C4C4; 
      border-radius: 5px;
    }
  `} overflow-x-hidden overflow-y-auto h-64`;

  if (pokemons.length === 0) return <div>EMPTY</div>;
  return (
    <div className={classes}>
      <InfiniteScroll
        dataLength={pokemons.length}
        next={next}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <div className="grid grid-cols-4" style={{ columnGap: '2rem', rowGap: '2rem' }}>
          {pokemons.map(pokemon => {
            const classes = classNames({
              'relative': true,
              'cursor-pointer': isPokemonAddedToSlot(pokemon) || availableSlots > 0
            });
            return (
              <div key={pokemon.id} className={classes} onClick={isPokemonAddedToSlot(pokemon) || availableSlots > 0 ? (() => pokemonClickHandler(pokemon)) : undefined}>
                <Pokemon pokemon={pokemon} /> 
                { isPokemonAddedToSlot(pokemon) && addedIndicatorElement }
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
}