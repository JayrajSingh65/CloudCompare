export type Platform = 'azure' | 'aws';

export interface ConfigOption {
  name: string;
  description: string;
  defaultValue: string;
  azureEquivalent?: string;
  awsEquivalent?: string;
}

export type ServiceCategory = 
  | 'Compute'
  | 'Storage'
  | 'Database'
  | 'Networking'
  | 'Security'
  | 'AI / ML'
  | 'Containers'
  | 'Integration'
  | 'Analytics';

export interface ServiceEntry {
  id: string;
  platform: Platform;
  serviceName: string;
  category: ServiceCategory;
  description: string; // Markdown supported
  keyFeatures: string[];
  pricingModel: string;
  configOptions: ConfigOption[];
  equivalentServiceId?: string; // ID of counterpart service
  useCases: string[];
  limitations?: string[];
  documentationLink?: string;
  iconName?: string; // Optional Lucide icon identifier
  updatedAt?: string;
}

export interface ComparisonPair {
  id: string;
  azureServiceId: string;
  awsServiceId: string;
  category: ServiceCategory;
  summaryOfDifferences: string;
  keyVerdict?: string;
  featured?: boolean;
}

export interface ServiceFilterOptions {
  searchQuery: string;
  platform: 'all' | Platform;
  category: 'all' | ServiceCategory;
  hasPairOnly?: boolean;
}
