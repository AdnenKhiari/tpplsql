import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILaboratoire } from '../laboratoire.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../laboratoire.test-samples';

import { LaboratoireService } from './laboratoire.service';

const requireRestSample: ILaboratoire = {
  ...sampleWithRequiredData,
};

describe('Laboratoire Service', () => {
  let service: LaboratoireService;
  let httpMock: HttpTestingController;
  let expectedResult: ILaboratoire | ILaboratoire[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LaboratoireService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Laboratoire', () => {
      const laboratoire = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(laboratoire).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Laboratoire', () => {
      const laboratoire = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(laboratoire).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Laboratoire', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Laboratoire', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Laboratoire', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLaboratoireToCollectionIfMissing', () => {
      it('should add a Laboratoire to an empty array', () => {
        const laboratoire: ILaboratoire = sampleWithRequiredData;
        expectedResult = service.addLaboratoireToCollectionIfMissing([], laboratoire);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(laboratoire);
      });

      it('should not add a Laboratoire to an array that contains it', () => {
        const laboratoire: ILaboratoire = sampleWithRequiredData;
        const laboratoireCollection: ILaboratoire[] = [
          {
            ...laboratoire,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLaboratoireToCollectionIfMissing(laboratoireCollection, laboratoire);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Laboratoire to an array that doesn't contain it", () => {
        const laboratoire: ILaboratoire = sampleWithRequiredData;
        const laboratoireCollection: ILaboratoire[] = [sampleWithPartialData];
        expectedResult = service.addLaboratoireToCollectionIfMissing(laboratoireCollection, laboratoire);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(laboratoire);
      });

      it('should add only unique Laboratoire to an array', () => {
        const laboratoireArray: ILaboratoire[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const laboratoireCollection: ILaboratoire[] = [sampleWithRequiredData];
        expectedResult = service.addLaboratoireToCollectionIfMissing(laboratoireCollection, ...laboratoireArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const laboratoire: ILaboratoire = sampleWithRequiredData;
        const laboratoire2: ILaboratoire = sampleWithPartialData;
        expectedResult = service.addLaboratoireToCollectionIfMissing([], laboratoire, laboratoire2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(laboratoire);
        expect(expectedResult).toContain(laboratoire2);
      });

      it('should accept null and undefined values', () => {
        const laboratoire: ILaboratoire = sampleWithRequiredData;
        expectedResult = service.addLaboratoireToCollectionIfMissing([], null, laboratoire, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(laboratoire);
      });

      it('should return initial array if no Laboratoire is added', () => {
        const laboratoireCollection: ILaboratoire[] = [sampleWithRequiredData];
        expectedResult = service.addLaboratoireToCollectionIfMissing(laboratoireCollection, undefined, null);
        expect(expectedResult).toEqual(laboratoireCollection);
      });
    });

    describe('compareLaboratoire', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLaboratoire(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { labno: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLaboratoire(entity1, entity2);
        const compareResult2 = service.compareLaboratoire(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { labno: 123 };
        const entity2 = { labno: 456 };

        const compareResult1 = service.compareLaboratoire(entity1, entity2);
        const compareResult2 = service.compareLaboratoire(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { labno: 123 };
        const entity2 = { labno: 123 };

        const compareResult1 = service.compareLaboratoire(entity1, entity2);
        const compareResult2 = service.compareLaboratoire(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
