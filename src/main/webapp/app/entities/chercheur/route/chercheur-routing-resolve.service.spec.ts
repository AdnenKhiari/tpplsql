import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IChercheur } from '../chercheur.model';
import { ChercheurService } from '../service/chercheur.service';

import chercheurResolve from './chercheur-routing-resolve.service';

describe('Chercheur routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let service: ChercheurService;
  let resultChercheur: IChercheur | null | undefined;

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
    service = TestBed.inject(ChercheurService);
    resultChercheur = undefined;
  });

  describe('resolve', () => {
    it('should return IChercheur returned by find', () => {
      // GIVEN
      service.find = jest.fn(chno => of(new HttpResponse({ body: { chno } })));
      mockActivatedRouteSnapshot.params = { chno: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        chercheurResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultChercheur = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultChercheur).toEqual({ chno: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      TestBed.runInInjectionContext(() => {
        chercheurResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultChercheur = result;
          },
        });
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultChercheur).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IChercheur>({ body: null })));
      mockActivatedRouteSnapshot.params = { chno: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        chercheurResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultChercheur = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultChercheur).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
