import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPublier, NewPublier } from '../publier.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { pubId: unknown }> = Partial<Omit<T, 'pubId'>> & { pubId: T['pubId'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPublier for edit and NewPublierFormGroupInput for create.
 */
type PublierFormGroupInput = IPublier | PartialWithRequiredKeyOf<NewPublier>;

type PublierFormDefaults = Pick<NewPublier, 'pubId'>;

type PublierFormGroupContent = {
  pubId: FormControl<IPublier['pubId'] | NewPublier['pubId']>;
  rang: FormControl<IPublier['rang']>;
  pubno: FormControl<IPublier['pubno']>;
  chno: FormControl<IPublier['chno']>;
};

export type PublierFormGroup = FormGroup<PublierFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PublierFormService {
  createPublierFormGroup(publier: PublierFormGroupInput = { pubId: null }): PublierFormGroup {
    const publierRawValue = {
      ...this.getFormDefaults(),
      ...publier,
    };
    return new FormGroup<PublierFormGroupContent>({
      pubId: new FormControl(
        { value: publierRawValue.pubId, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      rang: new FormControl(publierRawValue.rang, {
        validators: [Validators.required],
      }),
      pubno: new FormControl(publierRawValue.pubno, {
        validators: [Validators.required],
      }),
      chno: new FormControl(publierRawValue.chno, {
        validators: [Validators.required],
      }),
    });
  }

  getPublier(form: PublierFormGroup): IPublier | NewPublier {
    return form.getRawValue() as IPublier | NewPublier;
  }

  resetForm(form: PublierFormGroup, publier: PublierFormGroupInput): void {
    const publierRawValue = { ...this.getFormDefaults(), ...publier };
    form.reset(
      {
        ...publierRawValue,
        pubId: { value: publierRawValue.pubId, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PublierFormDefaults {
    return {
      pubId: null,
    };
  }
}
