import { IFaculte, NewFaculte } from './faculte.model';

export const sampleWithRequiredData: IFaculte = {
  facno: 29485,
  facnom: 'sus parce que',
  adresse: 'étouffer',
  libelle: 'communauté étudiante',
};

export const sampleWithPartialData: IFaculte = {
  facno: 6152,
  facnom: 'diablement',
  adresse: 'commis',
  libelle: 'du fait que grandement pschitt',
};

export const sampleWithFullData: IFaculte = {
  facno: 5964,
  facnom: 'population du Québec bûcher d’autant que',
  adresse: 'désormais au dépens de',
  libelle: 'bof quand population du Québec',
};

export const sampleWithNewData: NewFaculte = {
  facnom: 'dès',
  adresse: 'introduire adversaire lorsque',
  libelle: 'hier',
  facno: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
