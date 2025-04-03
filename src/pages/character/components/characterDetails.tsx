import React from "react";
import { useParams } from "react-router-dom";
import { useFetchCharacter } from "../services/useCharacterApi";
import { Character } from "../../../core/interface/CharacterInterface";
import { Spinner } from "flowbite-react";

const CharacterDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useFetchCharacter(id);
  const character: Character | undefined = data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex items-center gap-2 text-gray-600">
          <Spinner size="lg" color="purple" />
          <span className="text-lg font-medium">Loading character...</span>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Character not found.
      </div>
    );
  }

  const createdDate = new Date(character.created).toLocaleDateString();

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
        {character.name}
      </h1>

      <div className="bg-white border-4 border-black rounded-md shadow-md p-4 max-w-md w-full">
        <img
          src={character.image}
          alt={character.name}
          className="w-full h-auto rounded mb-4"
        />
        <ul className="text-md space-y-2 text-gray-800">
          <li>
            <strong>Status:</strong> {character.status}
          </li>
          <li>
            <strong>Species:</strong> {character.species}
          </li>
          <li>
            <strong>Gender:</strong> {character.gender}
          </li>
          <li>
            <strong>Origin:</strong> {character.origin.name}
          </li>
          <li>
            <strong>Location:</strong> {character.location.name}
          </li>
          <li>
            <strong>Created At:</strong> {createdDate}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CharacterDetails;
