import { IPublier, NewPublier } from './publier.model';

export const sampleWithRequiredData: IPublier = {
  pubId: 17350,
  rang: 6612,
};

export const sampleWithPartialData: IPublier = {
  pubId: 17210,
  rang: 1365,
};

export const sampleWithFullData: IPublier = {
  pubId: 3789,
  rang: 2062,
};

export const sampleWithNewData: NewPublier = {
  rang: 23515,
  pubId: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
