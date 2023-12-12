import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPublier } from '../publier.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../publier.test-samples';

import { PublierService } from './publier.service';

const requireRestSample: IPublier = {
  ...sampleWithRequiredData,
};

describe('Publier Service', () => {
  let service: PublierService;
  let httpMock: HttpTestingController;
  let expectedResult: IPublier | IPublier[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PublierService);
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

    it('should create a Publier', () => {
      const publier = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(publier).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Publier', () => {
      const publier = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(publier).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Publier', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Publier', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Publier', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPublierToCollectionIfMissing', () => {
      it('should add a Publier to an empty array', () => {
        const publier: IPublier = sampleWithRequiredData;
        expectedResult = service.addPublierToCollectionIfMissing([], publier);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(publier);
      });

      it('should not add a Publier to an array that contains it', () => {
        const publier: IPublier = sampleWithRequiredData;
        const publierCollection: IPublier[] = [
          {
            ...publier,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPublierToCollectionIfMissing(publierCollection, publier);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Publier to an array that doesn't contain it", () => {
        const publier: IPublier = sampleWithRequiredData;
        const publierCollection: IPublier[] = [sampleWithPartialData];
        expectedResult = service.addPublierToCollectionIfMissing(publierCollection, publier);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(publier);
      });

      it('should add only unique Publier to an array', () => {
        const publierArray: IPublier[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const publierCollection: IPublier[] = [sampleWithRequiredData];
        expectedResult = service.addPublierToCollectionIfMissing(publierCollection, ...publierArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const publier: IPublier = sampleWithRequiredData;
        const publier2: IPublier = sampleWithPartialData;
        expectedResult = service.addPublierToCollectionIfMissing([], publier, publier2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(publier);
        expect(expectedResult).toContain(publier2);
      });

      it('should accept null and undefined values', () => {
        const publier: IPublier = sampleWithRequiredData;
        expectedResult = service.addPublierToCollectionIfMissing([], null, publier, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(publier);
      });

      it('should return initial array if no Publier is added', () => {
        const publierCollection: IPublier[] = [sampleWithRequiredData];
        expectedResult = service.addPublierToCollectionIfMissing(publierCollection, undefined, null);
        expect(expectedResult).toEqual(publierCollection);
      });
    });

    describe('comparePublier', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePublier(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { pubId: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePublier(entity1, entity2);
        const compareResult2 = service.comparePublier(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { pubId: 123 };
        const entity2 = { pubId: 456 };

        const compareResult1 = service.comparePublier(entity1, entity2);
        const compareResult2 = service.comparePublier(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { pubId: 123 };
        const entity2 = { pubId: 123 };

        const compareResult1 = service.comparePublier(entity1, entity2);
        const compareResult2 = service.comparePublier(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
