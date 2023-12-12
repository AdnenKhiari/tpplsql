import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFaculte } from '../faculte.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../faculte.test-samples';

import { FaculteService } from './faculte.service';

const requireRestSample: IFaculte = {
  ...sampleWithRequiredData,
};

describe('Faculte Service', () => {
  let service: FaculteService;
  let httpMock: HttpTestingController;
  let expectedResult: IFaculte | IFaculte[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FaculteService);
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

    it('should create a Faculte', () => {
      const faculte = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(faculte).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Faculte', () => {
      const faculte = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(faculte).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Faculte', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Faculte', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Faculte', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFaculteToCollectionIfMissing', () => {
      it('should add a Faculte to an empty array', () => {
        const faculte: IFaculte = sampleWithRequiredData;
        expectedResult = service.addFaculteToCollectionIfMissing([], faculte);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(faculte);
      });

      it('should not add a Faculte to an array that contains it', () => {
        const faculte: IFaculte = sampleWithRequiredData;
        const faculteCollection: IFaculte[] = [
          {
            ...faculte,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFaculteToCollectionIfMissing(faculteCollection, faculte);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Faculte to an array that doesn't contain it", () => {
        const faculte: IFaculte = sampleWithRequiredData;
        const faculteCollection: IFaculte[] = [sampleWithPartialData];
        expectedResult = service.addFaculteToCollectionIfMissing(faculteCollection, faculte);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(faculte);
      });

      it('should add only unique Faculte to an array', () => {
        const faculteArray: IFaculte[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const faculteCollection: IFaculte[] = [sampleWithRequiredData];
        expectedResult = service.addFaculteToCollectionIfMissing(faculteCollection, ...faculteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const faculte: IFaculte = sampleWithRequiredData;
        const faculte2: IFaculte = sampleWithPartialData;
        expectedResult = service.addFaculteToCollectionIfMissing([], faculte, faculte2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(faculte);
        expect(expectedResult).toContain(faculte2);
      });

      it('should accept null and undefined values', () => {
        const faculte: IFaculte = sampleWithRequiredData;
        expectedResult = service.addFaculteToCollectionIfMissing([], null, faculte, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(faculte);
      });

      it('should return initial array if no Faculte is added', () => {
        const faculteCollection: IFaculte[] = [sampleWithRequiredData];
        expectedResult = service.addFaculteToCollectionIfMissing(faculteCollection, undefined, null);
        expect(expectedResult).toEqual(faculteCollection);
      });
    });

    describe('compareFaculte', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFaculte(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { facno: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFaculte(entity1, entity2);
        const compareResult2 = service.compareFaculte(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { facno: 123 };
        const entity2 = { facno: 456 };

        const compareResult1 = service.compareFaculte(entity1, entity2);
        const compareResult2 = service.compareFaculte(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { facno: 123 };
        const entity2 = { facno: 123 };

        const compareResult1 = service.compareFaculte(entity1, entity2);
        const compareResult2 = service.compareFaculte(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
