import { IconName } from '../../components/icon/storage/icons.data';
import { ShopTranslations } from '../shop/shop.model';

export enum ActionType {
  MODAL = 'MODAL',
  LINK = 'LINK',
  EXTERNAL = 'EXTERNAL',
  REDIRECT = 'REDIRECT'
}

export interface BaseService {
  id: string;
  icon: IconName;
  price: number;
  actionType: string | ActionType;
  actionValue: string;
}

export interface Service extends BaseService {
  title: string;
  description: string;
}

export interface ServiceAdmin extends BaseService {
  showFlag: boolean;
  translations: ShopTranslations[];
}

export type ServiceEntity = BaseService & Partial<Service> & Partial<ServiceAdmin>;

export interface ServiceState {
  isLoading: boolean;
  error: string | null;
}

export const serviceUtils = {
  isModal: (type: string | ActionType) => type === ActionType.MODAL,
  isLink: (type: string | ActionType) => type === ActionType.LINK,
  isExternal: (type: string | ActionType) => type === ActionType.EXTERNAL,
  isRedirect: (type: string | ActionType) => type === ActionType.REDIRECT,
};
