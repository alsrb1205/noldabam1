import { createContext, useContext, useState } from 'react';

const CategoryContext = createContext();

export function CategoryProvider({ children }) {
  const [isSticky, setIsSticky] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const value = {
    isSticky,
    setIsSticky,
    isOpening,
    setIsOpening
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
} 