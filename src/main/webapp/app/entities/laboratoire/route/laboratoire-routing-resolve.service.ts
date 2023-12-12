import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILaboratoire } from '../laboratoire.model';
import { LaboratoireService } from '../service/laboratoire.service';

export const laboratoireResolve = (route: ActivatedRouteSnapshot): Observable<null | ILaboratoire> => {
  const id = route.params['labno'];
  if (id) {
    return inject(LaboratoireService)
      .find(id)
      .pipe(
        mergeMap((laboratoire: HttpResponse<ILaboratoire>) => {
          if (laboratoire.body) {
            return of(laboratoire.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default laboratoireResolve;
