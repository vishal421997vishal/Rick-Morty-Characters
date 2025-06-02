import React, {useCallback, useEffect, useMemo, useState, useRef} from 'react';
import {useFetchCharactersApi} from '../services/useCharacterApi';
import {Character} from '../../../core/interface/CharacterInterface';
import {useInView} from 'react-intersection-observer';
import {Button, TextInput} from 'flowbite-react';
import {Link} from 'react-router-dom';
import {debounce} from 'lodash';
import {FaArrowUp, FaExclamationTriangle} from 'react-icons/fa';

const CharacterSkeleton = () => (
  <div className="group relative overflow-hidden border-4 border-black bg-white shadow-md hover:scale-105 transition-all duration-300 hover:shadow-xl cursor-pointer">
    {/* Image skeleton */}
    <div className="w-full aspect-square bg-gray-200 animate-pulse" />

    {/* Bottom name tag */}
    <div className="absolute bottom-0 right-0 text-sm sm:text-base font-bold italic shadow text-right z-10 group-hover:opacity-0 transition-all duration-300">
      <div className="bg-white px-2 py-1 border-t-2 border-l-2 border-gray-500">
        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
      </div>
    </div>

    {/* Hover overlay */}
    <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-2 z-20 transform translate-y-2 group-hover:translate-y-0">
      {/* Date */}
      <div className="absolute top-2 right-2 bg-white text-xs sm:text-sm px-2 py-1 rounded-full text-gray-700 font-medium">
        <div className="h-3 w-20 bg-gray-200 animate-pulse rounded" />
      </div>

      {/* Character name */}
      <div className="text-white text-lg sm:text-xl font-bold italic mb-1">
        <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded" />
      </div>

      {/* Status and species */}
      <div className="text-white text-sm sm:text-md flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
      </div>
    </div>
  </div>
);

const Characters: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [search, setSearch] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const characterGridRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {data, isLoading, error: apiError, isError} = useFetchCharactersApi(page);
  const {ref, inView} = useInView();

  const filteredCharacters = useMemo(() => {
    return allCharacters.filter((char) =>
      char.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, allCharacters]);

  useEffect(() => {
    if (page === 1) {
      setAllCharacters([]);
    }
  }, [page]);

  useEffect(() => {
    if (data?.results) {
      setAllCharacters((prev) => [...prev, ...data.results]);
      setError('');
    }
  }, [data]);

  useEffect(() => {
    if (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Failed to load characters');
    }
  }, [apiError]);

  useEffect(() => {
    if (inView && !isLoading && data?.info.next) {
      setPage((prev) => prev + 1);
    }
  }, [inView, isLoading, data]);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="sticky top-0 z-20 bg-black/40 text-white py-4 mb-4 backdrop-blur-sm transition-all duration-300">
        <div className="running-text-container overflow-hidden">
          <h1 className="text-3xl font-bold text-center hover:scale-105 transition-transform running-text">
            Rick & Morty Characters
          </h1>
        </div>
        <div className="mt-4 max-w-md mx-auto px-4">
          <TextInput
            id="search"
            type="text"
            value={inputValue}
            onChange={handleSearchChange}
            placeholder="Search characters..."
            className="w-full transition-all duration-300 hover:shadow-lg animate-fade-in typing-placeholder"
            sizing="md"
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-center py-4 bg-red-100 mb-4 animate-shake flex items-center justify-center gap-2">
          <FaExclamationTriangle />
          <span>{error}</span>
        </div>
      )}

      {isLoading && page === 1 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-5">
          {Array.from({length: 10}).map((_, index) => (
            <div key={index} className="character-card">
              <CharacterSkeleton />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">Failed to load characters. Please try again later.</p>
          <Button
            color="gray"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : allCharacters.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">No characters found. Please try again later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-5">
          {filteredCharacters.map((character, index) => {
            const createdDate = new Date(character.created).toLocaleDateString();

            return (
              <Link
                to={`/character/${character.id}`}
                key={character.id}
                className="character-card floating"
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                <div className="group relative overflow-hidden border-4 border-black bg-white shadow-md hover:scale-105 transition-all duration-300 hover:shadow-xl cursor-pointer">
                  <img
                    src={character.image}
                    alt={character.name}
                    className="w-full transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />

                  <div className="absolute bottom-0 right-0 text-sm sm:text-base font-bold italic shadow text-right z-10 group-hover:opacity-0 transition-all duration-300">
                    <p className="bg-white px-2 py-1 border-t-2 border-l-2 border-gray-500">
                      {character.name}
                    </p>
                  </div>

                  <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-2 z-20 transform translate-y-2 group-hover:translate-y-0">
                    <span className="absolute top-2 right-2 bg-white text-xs sm:text-sm px-2 py-1 rounded-full text-gray-700 font-medium">
                      {createdDate}
                    </span>
                    <p className="text-white text-lg sm:text-xl font-bold italic">
                      {character.name}
                    </p>
                    <p className="text-white text-sm sm:text-md flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full pulse ${
                          character.status === 'Alive'
                            ? 'bg-green-500'
                            : character.status === 'Dead'
                            ? 'bg-red-500'
                            : 'bg-gray-500'
                        }`}
                      />
                      {character.status} · {character.species}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div ref={ref} className="h-12 flex items-center justify-center mt-4">
        {isLoading && page > 1 ? (
          <div className="flex items-center gap-2 text-gray-600">
            <div className="animate-pulse flex items-center gap-3">
              <div className="h-8 w-8 bg-gray-200 rounded-full" />
              <div className="h-4 w-40 bg-gray-200 rounded" />
            </div>
          </div>
        ) : (
          !data?.info.next && allCharacters.length > 0 && (
            <p className="text-gray-400 animate-fade-in">No more characters</p>
          )
        )}
      </div>

      {showScrollTop && (
        <Button
          className="fixed bottom-8 right-8 rounded-full p-3 bg-purple-600 hover:bg-purple-700 transition-all duration-300 hover:scale-110 floating-button"
          onClick={scrollToTop}
        >
          <FaArrowUp className="text-xl" />
        </Button>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .character-card {
          opacity: 0;
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Characters;
