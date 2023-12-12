import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../publication.test-samples';

import { PublicationFormService } from './publication-form.service';

describe('Publication Form Service', () => {
  let service: PublicationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicationFormService);
  });

  describe('Service methods', () => {
    describe('createPublicationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPublicationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            pubno: expect.any(Object),
            titre: expect.any(Object),
            theme: expect.any(Object),
            type: expect.any(Object),
            volume: expect.any(Object),
            date: expect.any(Object),
            apparition: expect.any(Object),
            editeur: expect.any(Object),
          }),
        );
      });

      it('passing IPublication should create a new form with FormGroup', () => {
        const formGroup = service.createPublicationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            pubno: expect.any(Object),
            titre: expect.any(Object),
            theme: expect.any(Object),
            type: expect.any(Object),
            volume: expect.any(Object),
            date: expect.any(Object),
            apparition: expect.any(Object),
            editeur: expect.any(Object),
          }),
        );
      });
    });

    describe('getPublication', () => {
      it('should return NewPublication for default Publication initial value', () => {
        const formGroup = service.createPublicationFormGroup(sampleWithNewData);

        const publication = service.getPublication(formGroup) as any;

        expect(publication).toMatchObject(sampleWithNewData);
      });

      it('should return NewPublication for empty Publication initial value', () => {
        const formGroup = service.createPublicationFormGroup();

        const publication = service.getPublication(formGroup) as any;

        expect(publication).toMatchObject({});
      });

      it('should return IPublication', () => {
        const formGroup = service.createPublicationFormGroup(sampleWithRequiredData);

        const publication = service.getPublication(formGroup) as any;

        expect(publication).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPublication should not enable pubno FormControl', () => {
        const formGroup = service.createPublicationFormGroup();
        expect(formGroup.controls.pubno.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.pubno.disabled).toBe(true);
      });

      it('passing NewPublication should disable pubno FormControl', () => {
        const formGroup = service.createPublicationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.pubno.disabled).toBe(true);

        service.resetForm(formGroup, { pubno: null });

        expect(formGroup.controls.pubno.disabled).toBe(true);
      });
    });
  });
});
