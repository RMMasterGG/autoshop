import {IconName} from '../../../shared/components/icon/storage/icons.data';

export interface Feature {
  icon: IconName;
  title: string;
  description: string;
}

export const FEATURES_DATA: Feature[] = [
  {
    icon: 'groups',
    title: 'main.features.adv.1.title',
    description: 'main.features.adv.1.description'
  },
  {
    icon: 'precision_manufacturing',
    title: 'main.features.adv.2.title',
    description: 'main.features.adv.2.description'
  },
  {
    icon: 'verified',
    title: 'main.features.adv.3.title',
    description: 'main.features.adv.3.description'
  },
  {
    icon: 'payments',
    title: 'main.features.adv.4.title',
    description: 'main.features.adv.4.description'
  }
];
