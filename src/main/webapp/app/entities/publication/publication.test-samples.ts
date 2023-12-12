import dayjs from 'dayjs/esm';

import { IPublication, NewPublication } from './publication.model';

export const sampleWithRequiredData: IPublication = {
  pubno: 19116,
  titre: 'selon en dedans de',
  theme: 'blablabla',
  type: 'PC',
  volume: 4837,
  date: dayjs('2023-12-04'),
  apparition: 'si bien que population du Québec',
  editeur: 'clientèle',
};

export const sampleWithPartialData: IPublication = {
  pubno: 14368,
  titre: 'adversaire',
  theme: 'atchoum concernant',
  type: 'P',
  volume: 15077,
  date: dayjs('2023-12-05'),
  apparition: 'aussitôt de façon à ce que',
  editeur: 'affable du moment que au dépens de',
};

export const sampleWithFullData: IPublication = {
  pubno: 14471,
  titre: 'hôte âcre',
  theme: 'via',
  type: 'PC',
  volume: 12204,
  date: dayjs('2023-12-05'),
  apparition: 'présidence',
  editeur: 'dès',
};

export const sampleWithNewData: NewPublication = {
  titre: 'hystérique personnel professionnel corps enseignant',
  theme: 'délectable partenaire ding',
  type: 'P',
  volume: 17337,
  date: dayjs('2023-12-04'),
  apparition: 'triste employer',
  editeur: 'près vite',
  pubno: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
