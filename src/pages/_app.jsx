import { createContext } from 'react';
import Layout from '../components/Layout';
import usePokemons from '../hooks/usePokemons';
import usePokemonSlots from '../hooks/usePokemonSlots';
import '../styles/globals.css';

export const AppContext = createContext({});

function MyApp({ Component, pageProps }) {
  const { pokemons, addPokemons } = usePokemons();
  const { 
    pokemonSlots, availableSlots, selectedSlot,
    addPokemonToOpenSlot, removePokemonFromSlot,
    clearPokemonSlots, setSelectedSlot, isPokemonAddedToSlot
  } = usePokemonSlots();

  const values = {
    pokemons, addPokemons,
    pokemonSlots, availableSlots, selectedSlot,
    addPokemonToOpenSlot, removePokemonFromSlot,
    clearPokemonSlots, setSelectedSlot, isPokemonAddedToSlot
  };

  return (
    <AppContext.Provider value={values}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppContext.Provider>
  );
}

export default MyApp;