import type { ServiceEntry, ComparisonPair } from '../types/cloud';
import { INITIAL_SERVICES, INITIAL_PAIRS } from './seedData';

const SERVICES_KEY = 'cloudcompare_services';
const PAIRS_KEY = 'cloudcompare_pairs';

export class StorageService {
  /**
   * Get all service entries from local storage (or seed data fallback)
   */
  static getServices(): ServiceEntry[] {
    try {
      const stored = localStorage.getItem(SERVICES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse services from localStorage, falling back to seed data.', e);
    }
    // Initialize seed data if empty
    this.saveServices(INITIAL_SERVICES);
    return INITIAL_SERVICES;
  }

  /**
   * Save all service entries to local storage
   */
  static saveServices(services: ServiceEntry[]): void {
    try {
      localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
    } catch (e) {
      console.error('Failed to save services to localStorage', e);
    }
  }

  /**
   * Get all comparison pairs from local storage (or seed data fallback)
   */
  static getPairs(): ComparisonPair[] {
    try {
      const stored = localStorage.getItem(PAIRS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse pairs from localStorage, falling back to seed data.', e);
    }
    // Initialize seed data if empty
    this.savePairs(INITIAL_PAIRS);
    return INITIAL_PAIRS;
  }

  /**
   * Save all comparison pairs to local storage
   */
  static savePairs(pairs: ComparisonPair[]): void {
    try {
      localStorage.setItem(PAIRS_KEY, JSON.stringify(pairs));
    } catch (e) {
      console.error('Failed to save pairs to localStorage', e);
    }
  }

  /**
   * Reset local storage back to default seed data
   */
  static resetToSeedData(): { services: ServiceEntry[]; pairs: ComparisonPair[] } {
    localStorage.removeItem(SERVICES_KEY);
    localStorage.removeItem(PAIRS_KEY);
    this.saveServices(INITIAL_SERVICES);
    this.savePairs(INITIAL_PAIRS);
    return { services: INITIAL_SERVICES, pairs: INITIAL_PAIRS };
  }

  /**
   * Export all data as JSON string
   */
  static exportDataJSON(): string {
    const data = {
      services: this.getServices(),
      pairs: this.getPairs(),
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import data from JSON payload
   */
  static importDataJSON(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);

      if (Array.isArray(parsed)) {
        // Direct array of service entries
        const current = this.getServices();
        const merged = [...current];
        let addedCount = 0;

        parsed.forEach((item: any) => {
          if (item.id && item.platform && item.serviceName && item.category) {
            const index = merged.findIndex(s => s.id === item.id);
            if (index >= 0) {
              merged[index] = item;
            } else {
              merged.push(item);
              addedCount++;
            }
          }
        });

        this.saveServices(merged);
        return {
          success: true,
          message: `Imported ${addedCount} new/updated service entries successfully.`
        };
      } else if (parsed && typeof parsed === 'object') {
        let importedServicesCount = 0;
        let importedPairsCount = 0;

        if (Array.isArray(parsed.services)) {
          this.saveServices(parsed.services);
          importedServicesCount = parsed.services.length;
        }

        if (Array.isArray(parsed.pairs)) {
          this.savePairs(parsed.pairs);
          importedPairsCount = parsed.pairs.length;
        }

        return {
          success: true,
          message: `Successfully restored ${importedServicesCount} services and ${importedPairsCount} comparison pairs.`
        };
      }

      return { success: false, message: 'Invalid JSON format. Expected array or backup object.' };
    } catch (e: any) {
      return { success: false, message: `Import error: ${e.message}` };
    }
  }
}
