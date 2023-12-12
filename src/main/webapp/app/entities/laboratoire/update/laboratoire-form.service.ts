import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILaboratoire, NewLaboratoire } from '../laboratoire.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { labno: unknown }> = Partial<Omit<T, 'labno'>> & { labno: T['labno'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILaboratoire for edit and NewLaboratoireFormGroupInput for create.
 */
type LaboratoireFormGroupInput = ILaboratoire | PartialWithRequiredKeyOf<NewLaboratoire>;

type LaboratoireFormDefaults = Pick<NewLaboratoire, 'labno'>;

type LaboratoireFormGroupContent = {
  labno: FormControl<ILaboratoire['labno'] | NewLaboratoire['labno']>;
  labnom: FormControl<ILaboratoire['labnom']>;
  facno: FormControl<ILaboratoire['facno']>;
};

export type LaboratoireFormGroup = FormGroup<LaboratoireFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LaboratoireFormService {
  createLaboratoireFormGroup(laboratoire: LaboratoireFormGroupInput = { labno: null }): LaboratoireFormGroup {
    const laboratoireRawValue = {
      ...this.getFormDefaults(),
      ...laboratoire,
    };
    return new FormGroup<LaboratoireFormGroupContent>({
      labno: new FormControl(
        { value: laboratoireRawValue.labno, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      labnom: new FormControl(laboratoireRawValue.labnom, {
        validators: [Validators.required],
      }),
      facno: new FormControl(laboratoireRawValue.facno, {
        validators: [Validators.required],
      }),
    });
  }

  getLaboratoire(form: LaboratoireFormGroup): ILaboratoire | NewLaboratoire {
    return form.getRawValue() as ILaboratoire | NewLaboratoire;
  }

  resetForm(form: LaboratoireFormGroup, laboratoire: LaboratoireFormGroupInput): void {
    const laboratoireRawValue = { ...this.getFormDefaults(), ...laboratoire };
    form.reset(
      {
        ...laboratoireRawValue,
        labno: { value: laboratoireRawValue.labno, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): LaboratoireFormDefaults {
    return {
      labno: null,
    };
  }
}
