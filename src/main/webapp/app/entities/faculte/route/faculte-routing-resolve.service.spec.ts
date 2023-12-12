import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IFaculte } from '../faculte.model';
import { FaculteService } from '../service/faculte.service';

import faculteResolve from './faculte-routing-resolve.service';

describe('Faculte routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let service: FaculteService;
  let resultFaculte: IFaculte | null | undefined;

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
    service = TestBed.inject(FaculteService);
    resultFaculte = undefined;
  });

  describe('resolve', () => {
    it('should return IFaculte returned by find', () => {
      // GIVEN
      service.find = jest.fn(facno => of(new HttpResponse({ body: { facno } })));
      mockActivatedRouteSnapshot.params = { facno: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        faculteResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultFaculte = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFaculte).toEqual({ facno: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      TestBed.runInInjectionContext(() => {
        faculteResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultFaculte = result;
          },
        });
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultFaculte).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IFaculte>({ body: null })));
      mockActivatedRouteSnapshot.params = { facno: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        faculteResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultFaculte = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFaculte).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
