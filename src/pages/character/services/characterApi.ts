import axios from 'axios';
import {Character, CharacterInterface} from "../../../core/interface/CharacterInterface";

const BASE_URL = 'https://rickandmortyapi.com/api';

export const fetchCharactersApi = async (page: number): Promise<CharacterInterface> => {
  const response = await axios.get<CharacterInterface>(`${BASE_URL}/character?page=${page}`);
  return response.data;
};

export const fetchCharacterById = async (id: string): Promise<Character> => {
  const response = await axios.get<Character>(`${BASE_URL}/character/${id}`);
  return response.data;
}
