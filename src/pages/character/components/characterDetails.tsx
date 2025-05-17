import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetchCharacter } from "../services/useCharacterApi";
import { Character } from "../../../core/interface/CharacterInterface";
import { Spinner, Button, Badge, Toast } from "flowbite-react";
import { FaShare, FaArrowLeft } from "react-icons/fa";

const CharacterDetailsSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-10 px-6 flex flex-col items-center animate-pulse">
    <div className="w-full max-w-4xl bg-white border-2 border-black rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden">
      <div className="md:w-1/2 bg-gray-200 h-96" />
      <div className="md:w-1/2 p-6 flex flex-col justify-between">
        <div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CharacterDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: character, isLoading, error } = useFetchCharacter(id);
  const [showToast, setShowToast] = useState(false);

  if (isLoading) {
    return <CharacterDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="text-red-500 text-xl mb-4">Failed to load character details</div>
        <Button color="gray" onClick={() => navigate(-1)}>
          <FaArrowLeft className="mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="text-red-500 text-xl mb-4">Character not found</div>
        <Button color="gray" onClick={() => navigate(-1)}>
          <FaArrowLeft className="mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  const createdDate = new Date(character.created).toLocaleDateString();
  
  const handleShare = async () => {
    try {
      await navigator.share({
        title: `Rick and Morty - ${character.name}`,
        text: `Check out ${character.name} from Rick and Morty!`,
        url: window.location.href,
      });
    } catch (err) {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return 'success';
      case 'dead':
        return 'failure';
      default:
        return 'warning';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-10 px-6 flex flex-col items-center">
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast>
            <div className="text-sm font-normal">Link copied to clipboard!</div>
          </Toast>
        </div>
      )}
      
      <div className="w-full max-w-4xl">
        <Button color="gray" onClick={() => navigate(-1)} className="mb-4 hover:scale-105 transition-transform">
          <FaArrowLeft className="mr-2" /> Go Back
        </Button>
        
        <div className="bg-white border-2 border-black rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 relative group">
              <img
                src={character.image}
                alt={character.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4">
                <Button color="gray" onClick={handleShare} className="!p-2 hover:scale-110 transition-transform">
                  <FaShare />
                </Button>
              </div>
            </div>

            <div className="md:w-1/2 p-6 flex flex-col">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-blue-800">
                    {character.name}
                  </h1>
                  <Badge color={getStatusColor(character.status)} size="lg">
                    {character.status}
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Basic Information</h2>
                    <ul className="space-y-2">
                      <li><span className="font-medium">Species:</span> {character.species}</li>
                      <li><span className="font-medium">Gender:</span> {character.gender}</li>
                      <li><span className="font-medium">Type:</span> {character.type || 'Unknown'}</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Location</h2>
                    <ul className="space-y-2">
                      <li><span className="font-medium">Origin:</span> {character.origin.name}</li>
                      <li><span className="font-medium">Current Location:</span> {character.location.name}</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Additional Info</h2>
                    <ul className="space-y-2">
                      <li><span className="font-medium">Number of Episodes:</span> {character.episode.length}</li>
                      <li><span className="font-medium">First Appearance:</span> Episode {character.episode[0].split('/').pop()}</li>
                      <li><span className="font-medium">Created:</span> {createdDate}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetails;
