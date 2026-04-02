export interface BaseShop {
  id: string;
  linkImg: string;
  price: number;
  stock: number;
  category: string;
}

export interface Shop extends BaseShop {
  title: string;
  description: string;
}

export interface AdminShop extends BaseShop {
  showFlag: boolean;
  translations: ShopTranslations[];
}

export type ShopEntity = BaseShop & Partial<Shop> & Partial<AdminShop>;

export interface ShopTranslations {
  langCode: string;
  title: string;
  description: string;
}

export interface Category {
  id: string;
  title: string;
}

export interface ShopListResponse {
  totalElements: number;
  hasNext: boolean;
  nextOffset: number;
  cards: Shop[] | AdminShop[];
}

export type SortOption = 'news' | 'grand' | 'less';

export interface ShopState {
  isLoading: boolean;
  totalElements: number;
  hasNext: boolean;
  categories: Category[];
  currentCategories: string[];
  maxPrice: number | null;
  sort: SortOption;
  error: string | null;
}
