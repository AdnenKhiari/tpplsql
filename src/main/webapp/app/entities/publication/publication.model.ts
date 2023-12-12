import dayjs from 'dayjs/esm';
import { PublicationType } from 'app/entities/enumerations/publication-type.model';

export interface IPublication {
  pubno: number;
  titre?: string | null;
  theme?: string | null;
  type?: keyof typeof PublicationType | null;
  volume?: number | null;
  date?: dayjs.Dayjs | null;
  apparition?: string | null;
  editeur?: string | null;
}

export type NewPublication = Omit<IPublication, 'pubno'> & { pubno: null };
