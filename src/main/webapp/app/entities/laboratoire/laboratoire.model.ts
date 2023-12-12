import { IFaculte } from 'app/entities/faculte/faculte.model';

export interface ILaboratoire {
  labno: number;
  labnom?: string | null;
  facno?: IFaculte | null;
}

export type NewLaboratoire = Omit<ILaboratoire, 'labno'> & { labno: null };
