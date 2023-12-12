import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IChercheur } from '../chercheur.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../chercheur.test-samples';

import { ChercheurService, RestChercheur } from './chercheur.service';

const requireRestSample: RestChercheur = {
  ...sampleWithRequiredData,
  daterecrut: sampleWithRequiredData.daterecrut?.format(DATE_FORMAT),
};

describe('Chercheur Service', () => {
  let service: ChercheurService;
  let httpMock: HttpTestingController;
  let expectedResult: IChercheur | IChercheur[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ChercheurService);
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

    it('should create a Chercheur', () => {
      const chercheur = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(chercheur).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Chercheur', () => {
      const chercheur = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(chercheur).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Chercheur', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Chercheur', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Chercheur', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addChercheurToCollectionIfMissing', () => {
      it('should add a Chercheur to an empty array', () => {
        const chercheur: IChercheur = sampleWithRequiredData;
        expectedResult = service.addChercheurToCollectionIfMissing([], chercheur);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chercheur);
      });

      it('should not add a Chercheur to an array that contains it', () => {
        const chercheur: IChercheur = sampleWithRequiredData;
        const chercheurCollection: IChercheur[] = [
          {
            ...chercheur,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addChercheurToCollectionIfMissing(chercheurCollection, chercheur);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Chercheur to an array that doesn't contain it", () => {
        const chercheur: IChercheur = sampleWithRequiredData;
        const chercheurCollection: IChercheur[] = [sampleWithPartialData];
        expectedResult = service.addChercheurToCollectionIfMissing(chercheurCollection, chercheur);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chercheur);
      });

      it('should add only unique Chercheur to an array', () => {
        const chercheurArray: IChercheur[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const chercheurCollection: IChercheur[] = [sampleWithRequiredData];
        expectedResult = service.addChercheurToCollectionIfMissing(chercheurCollection, ...chercheurArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const chercheur: IChercheur = sampleWithRequiredData;
        const chercheur2: IChercheur = sampleWithPartialData;
        expectedResult = service.addChercheurToCollectionIfMissing([], chercheur, chercheur2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chercheur);
        expect(expectedResult).toContain(chercheur2);
      });

      it('should accept null and undefined values', () => {
        const chercheur: IChercheur = sampleWithRequiredData;
        expectedResult = service.addChercheurToCollectionIfMissing([], null, chercheur, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chercheur);
      });

      it('should return initial array if no Chercheur is added', () => {
        const chercheurCollection: IChercheur[] = [sampleWithRequiredData];
        expectedResult = service.addChercheurToCollectionIfMissing(chercheurCollection, undefined, null);
        expect(expectedResult).toEqual(chercheurCollection);
      });
    });

    describe('compareChercheur', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareChercheur(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { chno: 123 };
        const entity2 = null;

        const compareResult1 = service.compareChercheur(entity1, entity2);
        const compareResult2 = service.compareChercheur(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { chno: 123 };
        const entity2 = { chno: 456 };

        const compareResult1 = service.compareChercheur(entity1, entity2);
        const compareResult2 = service.compareChercheur(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { chno: 123 };
        const entity2 = { chno: 123 };

        const compareResult1 = service.compareChercheur(entity1, entity2);
        const compareResult2 = service.compareChercheur(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
