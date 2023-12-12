import { IPublication } from 'app/entities/publication/publication.model';
import { IChercheur } from 'app/entities/chercheur/chercheur.model';

export interface IPublier {
  pubId: number;
  rang?: number | null;
  pubno?: IPublication | null;
  chno?: IChercheur | null;
}

export type NewPublier = Omit<IPublier, 'pubId'> & { pubId: null };
