import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../publier.test-samples';

import { PublierFormService } from './publier-form.service';

describe('Publier Form Service', () => {
  let service: PublierFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublierFormService);
  });

  describe('Service methods', () => {
    describe('createPublierFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPublierFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            pubId: expect.any(Object),
            rang: expect.any(Object),
            pubno: expect.any(Object),
            chno: expect.any(Object),
          }),
        );
      });

      it('passing IPublier should create a new form with FormGroup', () => {
        const formGroup = service.createPublierFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            pubId: expect.any(Object),
            rang: expect.any(Object),
            pubno: expect.any(Object),
            chno: expect.any(Object),
          }),
        );
      });
    });

    describe('getPublier', () => {
      it('should return NewPublier for default Publier initial value', () => {
        const formGroup = service.createPublierFormGroup(sampleWithNewData);

        const publier = service.getPublier(formGroup) as any;

        expect(publier).toMatchObject(sampleWithNewData);
      });

      it('should return NewPublier for empty Publier initial value', () => {
        const formGroup = service.createPublierFormGroup();

        const publier = service.getPublier(formGroup) as any;

        expect(publier).toMatchObject({});
      });

      it('should return IPublier', () => {
        const formGroup = service.createPublierFormGroup(sampleWithRequiredData);

        const publier = service.getPublier(formGroup) as any;

        expect(publier).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPublier should not enable pubId FormControl', () => {
        const formGroup = service.createPublierFormGroup();
        expect(formGroup.controls.pubId.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.pubId.disabled).toBe(true);
      });

      it('passing NewPublier should disable pubId FormControl', () => {
        const formGroup = service.createPublierFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.pubId.disabled).toBe(true);

        service.resetForm(formGroup, { pubId: null });

        expect(formGroup.controls.pubId.disabled).toBe(true);
      });
    });
  });
});
