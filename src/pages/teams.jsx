import { useEffect, useState } from "react";
import Team from "../components/Team";
import InfiniteScroll from "react-infinite-scroll-component";

export default function MyTeams() {
  const [teams, setTeams] = useState([]);
  const [pokemons, setPokemons] = useState([]);
  const [hasMoreTeams, setHasMoreTeams] = useState(true);
  const size = 4;

  useEffect(() => {
    fetch(`/api/teams?size=${size}`).then(res => res.json())
      .then(({ results, next }) => {
        setTeams(results);
        if (!next) {
          setHasMoreTeams(false);
        }

        const pokemonIds = results
          .map(team => team.pokemons.map(({ id }) => id))
          .reduce((flat, val) => flat.concat(val), []);
        const uniquePokemonIds = [...new Set(pokemonIds)];

        return Promise.all(uniquePokemonIds.map(pokemonId => fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`).then(res => res.json())));
      })
      .then(pokemons => {
        setPokemons(pokemons);
      });
  }, []);

  function loadMoreTeams() {
    fetch(`/api/teams?size=${size}&offset=${teams.length}`).then(res => res.json())
      .then(({ results: newTeams, next }) => {
        setTeams([
          ...teams,
          ...newTeams,
        ]);
        if (!next) {
          setHasMoreTeams(false);
        }

        const pokemonIds = newTeams
          .map(team => team.pokemons.map(({ id }) => id))
          .reduce((flat, val) => flat.concat(val), []);
        const uniquePokemonIds = [...new Set(pokemonIds)];
        const missingPokemonIds = uniquePokemonIds.filter(pokemonId => pokemons.every(p => p.id !== pokemonId));

        return Promise.all(missingPokemonIds.map(pokemonId => fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`).then(res => res.json())));
      })
      .then(newPokemons => {
        setPokemons([
          ...pokemons,
          ...newPokemons
        ]);
      });
  }
  
  
  
  return (
    <>
      <InfiniteScroll
        dataLength={teams.length}
        next={loadMoreTeams}
        hasMore={hasMoreTeams}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        { teams.length > 0 && pokemons.length > 0 && (
          <ul>
            {teams.map(team => (
              <li key={team.id} className="mb-8 pb-4 last:border-transparent border-b border-solid border-black">
                <Team name={team.name} pokemons={team.pokemons.map(pokemon => pokemons.find(p => p.id === pokemon.id)).filter(pokemon => !!pokemon)} /> 
              </li>
            ))
            }
          </ul>
        )}
      </InfiniteScroll>
    </>
  );
}