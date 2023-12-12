import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPublication, NewPublication } from '../publication.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { pubno: unknown }> = Partial<Omit<T, 'pubno'>> & { pubno: T['pubno'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPublication for edit and NewPublicationFormGroupInput for create.
 */
type PublicationFormGroupInput = IPublication | PartialWithRequiredKeyOf<NewPublication>;

type PublicationFormDefaults = Pick<NewPublication, 'pubno'>;

type PublicationFormGroupContent = {
  pubno: FormControl<IPublication['pubno'] | NewPublication['pubno']>;
  titre: FormControl<IPublication['titre']>;
  theme: FormControl<IPublication['theme']>;
  type: FormControl<IPublication['type']>;
  volume: FormControl<IPublication['volume']>;
  date: FormControl<IPublication['date']>;
  apparition: FormControl<IPublication['apparition']>;
  editeur: FormControl<IPublication['editeur']>;
};

export type PublicationFormGroup = FormGroup<PublicationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PublicationFormService {
  createPublicationFormGroup(publication: PublicationFormGroupInput = { pubno: null }): PublicationFormGroup {
    const publicationRawValue = {
      ...this.getFormDefaults(),
      ...publication,
    };
    return new FormGroup<PublicationFormGroupContent>({
      pubno: new FormControl(
        { value: publicationRawValue.pubno, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      titre: new FormControl(publicationRawValue.titre, {
        validators: [Validators.required],
      }),
      theme: new FormControl(publicationRawValue.theme, {
        validators: [Validators.required],
      }),
      type: new FormControl(publicationRawValue.type, {
        validators: [Validators.required],
      }),
      volume: new FormControl(publicationRawValue.volume, {
        validators: [Validators.required],
      }),
      date: new FormControl(publicationRawValue.date, {
        validators: [Validators.required],
      }),
      apparition: new FormControl(publicationRawValue.apparition, {
        validators: [Validators.required],
      }),
      editeur: new FormControl(publicationRawValue.editeur, {
        validators: [Validators.required],
      }),
    });
  }

  getPublication(form: PublicationFormGroup): IPublication | NewPublication {
    return form.getRawValue() as IPublication | NewPublication;
  }

  resetForm(form: PublicationFormGroup, publication: PublicationFormGroupInput): void {
    const publicationRawValue = { ...this.getFormDefaults(), ...publication };
    form.reset(
      {
        ...publicationRawValue,
        pubno: { value: publicationRawValue.pubno, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PublicationFormDefaults {
    return {
      pubno: null,
    };
  }
}
