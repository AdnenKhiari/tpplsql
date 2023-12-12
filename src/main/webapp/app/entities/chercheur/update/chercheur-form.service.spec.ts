import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../chercheur.test-samples';

import { ChercheurFormService } from './chercheur-form.service';

describe('Chercheur Form Service', () => {
  let service: ChercheurFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChercheurFormService);
  });

  describe('Service methods', () => {
    describe('createChercheurFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createChercheurFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            chno: expect.any(Object),
            chnom: expect.any(Object),
            grade: expect.any(Object),
            statut: expect.any(Object),
            daterecrut: expect.any(Object),
            salaire: expect.any(Object),
            prime: expect.any(Object),
            email: expect.any(Object),
            labno: expect.any(Object),
            supno: expect.any(Object),
            facno: expect.any(Object),
          }),
        );
      });

      it('passing IChercheur should create a new form with FormGroup', () => {
        const formGroup = service.createChercheurFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            chno: expect.any(Object),
            chnom: expect.any(Object),
            grade: expect.any(Object),
            statut: expect.any(Object),
            daterecrut: expect.any(Object),
            salaire: expect.any(Object),
            prime: expect.any(Object),
            email: expect.any(Object),
            labno: expect.any(Object),
            supno: expect.any(Object),
            facno: expect.any(Object),
          }),
        );
      });
    });

    describe('getChercheur', () => {
      it('should return NewChercheur for default Chercheur initial value', () => {
        const formGroup = service.createChercheurFormGroup(sampleWithNewData);

        const chercheur = service.getChercheur(formGroup) as any;

        expect(chercheur).toMatchObject(sampleWithNewData);
      });

      it('should return NewChercheur for empty Chercheur initial value', () => {
        const formGroup = service.createChercheurFormGroup();

        const chercheur = service.getChercheur(formGroup) as any;

        expect(chercheur).toMatchObject({});
      });

      it('should return IChercheur', () => {
        const formGroup = service.createChercheurFormGroup(sampleWithRequiredData);

        const chercheur = service.getChercheur(formGroup) as any;

        expect(chercheur).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IChercheur should not enable chno FormControl', () => {
        const formGroup = service.createChercheurFormGroup();
        expect(formGroup.controls.chno.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.chno.disabled).toBe(true);
      });

      it('passing NewChercheur should disable chno FormControl', () => {
        const formGroup = service.createChercheurFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.chno.disabled).toBe(true);

        service.resetForm(formGroup, { chno: null });

        expect(formGroup.controls.chno.disabled).toBe(true);
      });
    });
  });
});
