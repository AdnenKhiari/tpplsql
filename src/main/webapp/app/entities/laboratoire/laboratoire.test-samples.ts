import { ILaboratoire, NewLaboratoire } from './laboratoire.model';

export const sampleWithRequiredData: ILaboratoire = {
  labno: 16567,
  labnom: 'de par',
};

export const sampleWithPartialData: ILaboratoire = {
  labno: 372,
  labnom: 'touriste',
};

export const sampleWithFullData: ILaboratoire = {
  labno: 20054,
  labnom: 'franco clientèle aussitôt que',
};

export const sampleWithNewData: NewLaboratoire = {
  labnom: 'là rectorat ouf',
  labno: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
