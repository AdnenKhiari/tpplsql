import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IChercheur, NewChercheur } from '../chercheur.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { chno: unknown }> = Partial<Omit<T, 'chno'>> & { chno: T['chno'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IChercheur for edit and NewChercheurFormGroupInput for create.
 */
type ChercheurFormGroupInput = IChercheur | PartialWithRequiredKeyOf<NewChercheur>;

type ChercheurFormDefaults = Pick<NewChercheur, 'chno'>;

type ChercheurFormGroupContent = {
  chno: FormControl<IChercheur['chno'] | NewChercheur['chno']>;
  chnom: FormControl<IChercheur['chnom']>;
  grade: FormControl<IChercheur['grade']>;
  statut: FormControl<IChercheur['statut']>;
  daterecrut: FormControl<IChercheur['daterecrut']>;
  salaire: FormControl<IChercheur['salaire']>;
  prime: FormControl<IChercheur['prime']>;
  email: FormControl<IChercheur['email']>;
  labno: FormControl<IChercheur['labno']>;
  supno: FormControl<IChercheur['supno']>;
  facno: FormControl<IChercheur['facno']>;
};

export type ChercheurFormGroup = FormGroup<ChercheurFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ChercheurFormService {
  createChercheurFormGroup(chercheur: ChercheurFormGroupInput = { chno: null }): ChercheurFormGroup {
    const chercheurRawValue = {
      ...this.getFormDefaults(),
      ...chercheur,
    };
    return new FormGroup<ChercheurFormGroupContent>({
      chno: new FormControl(
        { value: chercheurRawValue.chno, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      chnom: new FormControl(chercheurRawValue.chnom, {
        validators: [Validators.required],
      }),
      grade: new FormControl(chercheurRawValue.grade, {
        validators: [Validators.required],
      }),
      statut: new FormControl(chercheurRawValue.statut, {
        validators: [Validators.required],
      }),
      daterecrut: new FormControl(chercheurRawValue.daterecrut, {
        validators: [Validators.required],
      }),
      salaire: new FormControl(chercheurRawValue.salaire, {
        validators: [Validators.required],
      }),
      prime: new FormControl(chercheurRawValue.prime, {
        validators: [Validators.required],
      }),
      email: new FormControl(chercheurRawValue.email, {
        validators: [Validators.required],
      }),
      labno: new FormControl(chercheurRawValue.labno, {
        validators: [Validators.required],
      }),
      supno: new FormControl(chercheurRawValue.supno),
      facno: new FormControl(chercheurRawValue.facno, {
        validators: [Validators.required],
      }),
    });
  }

  getChercheur(form: ChercheurFormGroup): IChercheur | NewChercheur {
    return form.getRawValue() as IChercheur | NewChercheur;
  }

  resetForm(form: ChercheurFormGroup, chercheur: ChercheurFormGroupInput): void {
    const chercheurRawValue = { ...this.getFormDefaults(), ...chercheur };
    form.reset(
      {
        ...chercheurRawValue,
        chno: { value: chercheurRawValue.chno, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ChercheurFormDefaults {
    return {
      chno: null,
    };
  }
}
