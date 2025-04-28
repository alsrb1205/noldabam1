import { createContext, useContext, useState } from 'react';
import { useSelector } from 'react-redux';

const FormContext = createContext();

export function FormProvider({ children }) {
    const category = useSelector((state) => state.toggle.category);
    const userCount = useSelector((state) => state.userInfo.userCount);
    const isAccommodation = category === "accommodation";
  
    const reduxLocation = useSelector((state) => state.userInfo.location);
    const reduxSubLocation = useSelector((state) => state.userInfo.subLocation);
    const reduxType = useSelector((state) =>
      isAccommodation ? state.userInfo.accommodationType : state.userInfo.themeType
    );
  
    
    const [selectedRegion, setSelectedRegion] = useState(reduxLocation);
    const [selectedSubRegion, setSelectedSubRegion] = useState(reduxSubLocation);
    const [localType, setLocalType] = useState(reduxType);
    const [localUserCount, setLocalUserCount] = useState(userCount);
    

  const value = {
    selectedRegion,
    setSelectedRegion,
    selectedSubRegion,
    setSelectedSubRegion,
    localType,
    setLocalType,
    localUserCount,
    setLocalUserCount,
    
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
} 