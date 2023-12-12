import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IPublication } from '../publication.model';
import { PublicationService } from '../service/publication.service';

import publicationResolve from './publication-routing-resolve.service';

describe('Publication routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let service: PublicationService;
  let resultPublication: IPublication | null | undefined;

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
    service = TestBed.inject(PublicationService);
    resultPublication = undefined;
  });

  describe('resolve', () => {
    it('should return IPublication returned by find', () => {
      // GIVEN
      service.find = jest.fn(pubno => of(new HttpResponse({ body: { pubno } })));
      mockActivatedRouteSnapshot.params = { pubno: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        publicationResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultPublication = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPublication).toEqual({ pubno: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      TestBed.runInInjectionContext(() => {
        publicationResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultPublication = result;
          },
        });
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPublication).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IPublication>({ body: null })));
      mockActivatedRouteSnapshot.params = { pubno: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        publicationResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultPublication = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPublication).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
