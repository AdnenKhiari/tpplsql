import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ILaboratoire } from '../laboratoire.model';
import { LaboratoireService } from '../service/laboratoire.service';

import laboratoireResolve from './laboratoire-routing-resolve.service';

describe('Laboratoire routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let service: LaboratoireService;
  let resultLaboratoire: ILaboratoire | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    service = TestBed.inject(LaboratoireService);
    resultLaboratoire = undefined;
  });

  describe('resolve', () => {
    it('should return ILaboratoire returned by find', () => {
      // GIVEN
      service.find = jest.fn(labno => of(new HttpResponse({ body: { labno } })));
      mockActivatedRouteSnapshot.params = { labno: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        laboratoireResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultLaboratoire = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultLaboratoire).toEqual({ labno: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      TestBed.runInInjectionContext(() => {
        laboratoireResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultLaboratoire = result;
          },
        });
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultLaboratoire).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<ILaboratoire>({ body: null })));
      mockActivatedRouteSnapshot.params = { labno: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        laboratoireResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultLaboratoire = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultLaboratoire).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
