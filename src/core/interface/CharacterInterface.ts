export interface CharacterInterface {
  info: Info;
  results: Character[];
}

export interface Info {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface Character{
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: "Male" | "Female" | "Genderless" | "unknown";
  origin: LocationReference;
  location: LocationReference;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface LocationReference {
  name: string;
  url: string;
}
