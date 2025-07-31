export interface Breed {
  id: string;
  type: string;
  attributes: {
    name: string;
    description: string;
    life: {
      min: number;
      max: number;
    };
    male_weight: {
      min: number;
      max: number;
    };
    female_weight: {
      min: number;
      max: number;
    };
  };
}
