import { useMemo, useState, useEffect } from 'react';
import Pokemon from './Pokemon';
import InfiniteScroll from 'react-infinite-scroll-component';
import confirmIcon from '../../public/confirm-icon.svg';

export default function PokemonsList({ onPokemonClick }) {
  const [pokemons, setPokemons] = useState([]);

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

  const addedIndicatorElement = useMemo(() => (
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
      <div 
        style={{ backgroundColor: '#8FDA58' }}
        className="w-16 h-16 flex justify-center items-center rounded-full opacity-90">
        <img
          className="transform scale-150" 
          src={confirmIcon.src} 
        />
      </div>
    </div>), []);
  

  if (pokemons.length === 0) return <div>EMPTY</div>;
  return (
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
      <div className="grid grid-cols-4" style={{ columnGap: '1rem', rowGap: '1rem' }}>
        {pokemons.map(pokemon => (
          <div key={pokemon.id} className="relative cursor-pointer" onClick={() => onPokemonClick(pokemon)}>
            <Pokemon pokemon={pokemon} /> 
            { pokemon.added && addedIndicatorElement }
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
}