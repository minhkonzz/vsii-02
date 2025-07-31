declare module '*.json' {
  const value: {
    data: Array<{
      id: string;
      type: string;
      attributes: {
        name: string;
        description: string;
        life: { min: number; max: number };
        male_weight: { min: number; max: number };
        female_weight: { min: number; max: number };
      };
    }>;
  };
  export default value;
}
