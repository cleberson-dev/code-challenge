import { useEffect, useState } from "react";
import Team from "../components/Team";

export default function MyTeams() {
  const [teams, setTeams] = useState([]);
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    fetch('/api/teams').then(res => res.json())
      .then(teams => {
        setTeams(teams);
        const pokemonIds = teams
          .map(team => team.pokemons.map(({ id }) => id))
          .reduce((flat, val) => flat.concat(val), []);
        const uniquePokemonIds = [...new Set(pokemonIds)];

        return Promise.all(uniquePokemonIds.map(pokemonId => fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`).then(res => res.json())));
      })
      .then(pokemons => {
        setPokemons(pokemons);
      });
  }, []);
  
  
  
  return (
    <>
      { teams.length > 0 && pokemons.length > 0 && (
        <ul>
          {teams.map(team => (
            <li key={team.id} className="mb-8 border-b border-solid border-black">
              <Team name={team.name} pokemons={team.pokemons.map(pokemon => pokemons.find(p => p.id === pokemon.id))} /> 
            </li>
          ))
          }
        </ul>
      )}
    </>
  );
}