import React, {useEffect, useMemo, useState} from 'react';
import {useFetchCharactersApi} from '../services/useCharacterApi';
import {Character} from '../../../core/interface/CharacterInterface';
import {useInView} from 'react-intersection-observer';
import {Spinner, TextInput} from 'flowbite-react';
import {Link} from 'react-router-dom';

const Characters: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [search, setSearch] = useState<string>('');

  const {data, isLoading} = useFetchCharactersApi(page);
  const {ref, inView} = useInView();

  useEffect(() => {
    if (data?.results) {
      setAllCharacters((prev) => [...prev, ...data.results]);
    }
  }, [data]);

  useEffect(() => {
    if (inView && !isLoading && data?.info.next) {
      setPage((prev) => prev + 1);
    }
  }, [inView, isLoading, data]);

  const filteredCharacters = useMemo(() => {
    return allCharacters.filter((char) =>
      char.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, allCharacters]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="sticky top-0 z-20 bg-black/40 text-white py-4 mb-4 backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-center">Rick & Morty Characters</h1>
        <div className="mt-4 max-w-md mx-auto px-4">
          <TextInput
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search characters..."
            className="w-full"
            sizing="md"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-5">
        {filteredCharacters.map((character) => {
          const createdDate = new Date(character.created).toLocaleDateString();

          return (
            <Link to={`/character/${character.id}`} key={character.id}>
              <div
                className="relative overflow-hidden border-4 border-black bg-white shadow-md hover:scale-105 transition-transform cursor-pointer">
                <img src={character.image} alt={character.name} className="w-full"/>
                <div
                  className="absolute inset-0 bg-black bg-opacity-60 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2">
                  <span
                    className="absolute top-1 right-1 bg-white text-xs sm:text-sm px-1 py-[2px] rounded shadow text-gray-700 font-medium">
                    {createdDate}
                  </span>
                  <p className="text-white text-lg sm:text-xl font-bold italic">{character.name}</p>
                  <p className="text-white text-sm sm:text-md">
                    {character.status} · {character.species}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div ref={ref} className="h-12 flex items-center justify-center mt-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-600">
            <Spinner color="purple" size="md"/>
            <span>Loading more characters...</span>
          </div>
        ) : (
          !data?.info.next && <p className="text-gray-400">No more characters</p>
        )}
      </div>
    </div>
  );
};

export default Characters;
