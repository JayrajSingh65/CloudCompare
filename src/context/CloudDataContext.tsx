import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ServiceEntry, ComparisonPair, ServiceCategory } from '../types/cloud';
import { StorageService } from '../services/storageService';

interface CloudDataContextType {
  services: ServiceEntry[];
  pairs: ComparisonPair[];
  categories: ServiceCategory[];
  getService: (id: string) => ServiceEntry | undefined;
  getPair: (azureId: string, awsId: string) => ComparisonPair | undefined;
  saveService: (service: ServiceEntry) => void;
  deleteService: (id: string) => void;
  savePair: (pair: ComparisonPair) => void;
  deletePair: (id: string) => void;
  resetToSeedData: () => void;
  exportData: () => string;
  importData: (json: string) => { success: boolean; message: string };
}

const CloudDataContext = createContext<CloudDataContextType | undefined>(undefined);

export const CloudDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<ServiceEntry[]>([]);
  const [pairs, setPairs] = useState<ComparisonPair[]>([]);

  useEffect(() => {
    const loadedServices = StorageService.getServices();
    const loadedPairs = StorageService.getPairs();
    setServices(loadedServices);
    setPairs(loadedPairs);
  }, []);

  const categories: ServiceCategory[] = [
    'Compute',
    'Storage',
    'Database',
    'Networking',
    'Containers',
    'AI / ML'
  ];

  const getService = (id: string) => {
    return services.find(s => s.id === id);
  };

  const getPair = (azureId: string, awsId: string) => {
    return pairs.find(
      p =>
        (p.azureServiceId === azureId && p.awsServiceId === awsId) ||
        (p.azureServiceId === awsId && p.awsServiceId === azureId)
    );
  };

  const saveService = (service: ServiceEntry) => {
    const index = services.findIndex(s => s.id === service.id);
    let updated: ServiceEntry[];
    if (index >= 0) {
      updated = [...services];
      updated[index] = service;
    } else {
      updated = [...services, service];
    }
    setServices(updated);
    StorageService.saveServices(updated);
  };

  const deleteService = (id: string) => {
    const updatedServices = services.filter(s => s.id !== id);
    const updatedPairs = pairs.filter(p => p.azureServiceId !== id && p.awsServiceId !== id);
    setServices(updatedServices);
    setPairs(updatedPairs);
    StorageService.saveServices(updatedServices);
    StorageService.savePairs(updatedPairs);
  };

  const savePair = (pair: ComparisonPair) => {
    const index = pairs.findIndex(p => p.id === pair.id);
    let updated: ComparisonPair[];
    if (index >= 0) {
      updated = [...pairs];
      updated[index] = pair;
    } else {
      updated = [...pairs, pair];
    }

    // Also update equivalent service IDs bidirectionally if linked
    const azureServ = services.find(s => s.id === pair.azureServiceId);
    const awsServ = services.find(s => s.id === pair.awsServiceId);

    if (azureServ && awsServ) {
      const updatedServices = services.map(s => {
        if (s.id === azureServ.id) return { ...s, equivalentServiceId: awsServ.id };
        if (s.id === awsServ.id) return { ...s, equivalentServiceId: azureServ.id };
        return s;
      });
      setServices(updatedServices);
      StorageService.saveServices(updatedServices);
    }

    setPairs(updated);
    StorageService.savePairs(updated);
  };

  const deletePair = (id: string) => {
    const updated = pairs.filter(p => p.id !== id);
    setPairs(updated);
    StorageService.savePairs(updated);
  };

  const resetToSeedData = () => {
    const { services: s, pairs: p } = StorageService.resetToSeedData();
    setServices(s);
    setPairs(p);
  };

  const exportData = () => {
    return StorageService.exportDataJSON();
  };

  const importData = (json: string) => {
    const result = StorageService.importDataJSON(json);
    if (result.success) {
      setServices(StorageService.getServices());
      setPairs(StorageService.getPairs());
    }
    return result;
  };

  return (
    <CloudDataContext.Provider
      value={{
        services,
        pairs,
        categories,
        getService,
        getPair,
        saveService,
        deleteService,
        savePair,
        deletePair,
        resetToSeedData,
        exportData,
        importData
      }}
    >
      {children}
    </CloudDataContext.Provider>
  );
};

export const useCloudData = () => {
  const context = useContext(CloudDataContext);
  if (!context) {
    throw new Error('useCloudData must be used within a CloudDataProvider');
  }
  return context;
};
