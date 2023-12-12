export interface IFaculte {
  facno: number;
  facnom?: string | null;
  adresse?: string | null;
  libelle?: string | null;
}

export type NewFaculte = Omit<IFaculte, 'facno'> & { facno: null };
