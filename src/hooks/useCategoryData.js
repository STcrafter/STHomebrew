import { getCategoryStore, loadCategory } from '../data/store.js';

export function useCategoryData(category) {
  loadCategory(category);
  return getCategoryStore(category);
}
