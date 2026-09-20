import { createContext, useContext, useState } from 'react';

// Modes: 'landing' | 'farmer' | 'expert'
const PersonaContext = createContext(null);

export function PersonaProvider({ children }) {
  const [mode, setMode] = useState('landing');

  // Shared farmer state (preserved across mode switches)
  const [farmerSelections, setFarmerSelections] = useState({
    category: null, form: null, transitRoute: null,
  });
  const [farmerResults, setFarmerResults] = useState(null);

  // Expert mode input state
  const [expertInputs, setExpertInputs] = useState({
    commodityPreset: 'Fresh Produce',
    waterActivity: 0.92,
    fatContent: 1.5,
    o2Percent: 5,
    co2Percent: 10,
    n2Percent: 85,
    respirationRate: 40,
    tempMin: 2, tempMax: 8,
    rhMin: 80, rhMax: 95,
    punctureRating: 'Standard Handling',
    equipment: 'VFFS',
    gaugeMin: 25, gaugeMax: 60,
    sealTempMin: 110, sealTempMax: 135,
  });
  const [expertResults, setExpertResults] = useState(null);

  return (
    <PersonaContext.Provider value={{
      mode, setMode,
      farmerSelections, setFarmerSelections,
      farmerResults, setFarmerResults,
      expertInputs, setExpertInputs,
      expertResults, setExpertResults,
    }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error('usePersona must be used within PersonaProvider');
  return ctx;
}
