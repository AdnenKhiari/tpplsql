import dayjs from 'dayjs/esm';
import { ILaboratoire } from 'app/entities/laboratoire/laboratoire.model';
import { IFaculte } from 'app/entities/faculte/faculte.model';
import { GradeType } from 'app/entities/enumerations/grade-type.model';
import { StatutType } from 'app/entities/enumerations/statut-type.model';

export interface IChercheur {
  chno: number;
  chnom?: string | null;
  grade?: keyof typeof GradeType | null;
  statut?: keyof typeof StatutType | null;
  daterecrut?: dayjs.Dayjs | null;
  salaire?: number | null;
  prime?: number | null;
  email?: string | null;
  labno?: ILaboratoire | null;
  supno?: IChercheur | null;
  facno?: IFaculte | null;
}

export type NewChercheur = Omit<IChercheur, 'chno'> & { chno: null };
