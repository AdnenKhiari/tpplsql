import dayjs from 'dayjs/esm';

import { IChercheur, NewChercheur } from './chercheur.model';

export const sampleWithRequiredData: IChercheur = {
  chno: 12729,
  chnom: 'aussitôt fourbe',
  grade: 'A',
  statut: 'P',
  daterecrut: dayjs('2023-12-04'),
  salaire: 7459.25,
  prime: 6354.19,
  email: 'Jacinthe.Joly@gmail.com',
};

export const sampleWithPartialData: IChercheur = {
  chno: 15466,
  chnom: 'd’autant que',
  grade: 'MC',
  statut: 'C',
  daterecrut: dayjs('2023-12-04'),
  salaire: 30712.01,
  prime: 5505.49,
  email: 'Jocelyn_Dupont2@gmail.com',
};

export const sampleWithFullData: IChercheur = {
  chno: 31777,
  chnom: "aïe à moins de à l'insu de",
  grade: 'MA',
  statut: 'P',
  daterecrut: dayjs('2023-12-05'),
  salaire: 10104.51,
  prime: 15009.49,
  email: 'Melodie.Gerard12@gmail.com',
};

export const sampleWithNewData: NewChercheur = {
  chnom: 'en face de pin-pon',
  grade: 'E',
  statut: 'C',
  daterecrut: dayjs('2023-12-04'),
  salaire: 21649.02,
  prime: 13076.33,
  email: 'Richard99@gmail.com',
  chno: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
