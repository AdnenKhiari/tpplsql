import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChercheur } from '../chercheur.model';
import { ChercheurService } from '../service/chercheur.service';

export const chercheurResolve = (route: ActivatedRouteSnapshot): Observable<null | IChercheur> => {
  const id = route.params['chno'];
  if (id) {
    return inject(ChercheurService)
      .find(id)
      .pipe(
        mergeMap((chercheur: HttpResponse<IChercheur>) => {
          if (chercheur.body) {
            return of(chercheur.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default chercheurResolve;
