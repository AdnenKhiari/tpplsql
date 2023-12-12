import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFaculte, NewFaculte } from '../faculte.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { facno: unknown }> = Partial<Omit<T, 'facno'>> & { facno: T['facno'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFaculte for edit and NewFaculteFormGroupInput for create.
 */
type FaculteFormGroupInput = IFaculte | PartialWithRequiredKeyOf<NewFaculte>;

type FaculteFormDefaults = Pick<NewFaculte, 'facno'>;

type FaculteFormGroupContent = {
  facno: FormControl<IFaculte['facno'] | NewFaculte['facno']>;
  facnom: FormControl<IFaculte['facnom']>;
  adresse: FormControl<IFaculte['adresse']>;
  libelle: FormControl<IFaculte['libelle']>;
};

export type FaculteFormGroup = FormGroup<FaculteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FaculteFormService {
  createFaculteFormGroup(faculte: FaculteFormGroupInput = { facno: null }): FaculteFormGroup {
    const faculteRawValue = {
      ...this.getFormDefaults(),
      ...faculte,
    };
    return new FormGroup<FaculteFormGroupContent>({
      facno: new FormControl(
        { value: faculteRawValue.facno, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      facnom: new FormControl(faculteRawValue.facnom, {
        validators: [Validators.required],
      }),
      adresse: new FormControl(faculteRawValue.adresse, {
        validators: [Validators.required],
      }),
      libelle: new FormControl(faculteRawValue.libelle, {
        validators: [Validators.required],
      }),
    });
  }

  getFaculte(form: FaculteFormGroup): IFaculte | NewFaculte {
    return form.getRawValue() as IFaculte | NewFaculte;
  }

  resetForm(form: FaculteFormGroup, faculte: FaculteFormGroupInput): void {
    const faculteRawValue = { ...this.getFormDefaults(), ...faculte };
    form.reset(
      {
        ...faculteRawValue,
        facno: { value: faculteRawValue.facno, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): FaculteFormDefaults {
    return {
      facno: null,
    };
  }
}
