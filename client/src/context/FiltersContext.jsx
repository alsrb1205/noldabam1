// contexts/FilterContext.jsx
import { createContext, useState } from "react";

export const FiltersContext = createContext();

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState([]); // accommodationList or themeList

  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </FiltersContext.Provider>
  );
};
