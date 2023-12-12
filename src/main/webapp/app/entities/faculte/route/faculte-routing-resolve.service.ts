import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFaculte } from '../faculte.model';
import { FaculteService } from '../service/faculte.service';

export const faculteResolve = (route: ActivatedRouteSnapshot): Observable<null | IFaculte> => {
  const id = route.params['facno'];
  if (id) {
    return inject(FaculteService)
      .find(id)
      .pipe(
        mergeMap((faculte: HttpResponse<IFaculte>) => {
          if (faculte.body) {
            return of(faculte.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default faculteResolve;
