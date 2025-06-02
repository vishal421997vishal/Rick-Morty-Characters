import axios from 'axios';
import {Character, CharacterInterface} from "../../../core/interface/CharacterInterface";

const BASE_URL = 'https://rickandmortyapi.com/api';

export const fetchCharactersApi = async (page: number): Promise<CharacterInterface> => {
  try {
    const response = await axios.get<CharacterInterface>(`${BASE_URL}/character?page=${page}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('No characters found');
      }
      if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later');
      }
      throw new Error('Failed to fetch characters. Please check your internet connection');
    }
    throw error;
  }
};

export const fetchCharacterById = async (id: string): Promise<Character> => {
  try {
    const response = await axios.get<Character>(`${BASE_URL}/character/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Character not found');
      }
      if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later');
      }
      throw new Error('Failed to fetch character. Please check your internet connection');
    }
    throw error;
  }
};
