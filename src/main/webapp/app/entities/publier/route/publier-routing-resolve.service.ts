import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPublier } from '../publier.model';
import { PublierService } from '../service/publier.service';

export const publierResolve = (route: ActivatedRouteSnapshot): Observable<null | IPublier> => {
  const id = route.params['pubId'];
  if (id) {
    return inject(PublierService)
      .find(id)
      .pipe(
        mergeMap((publier: HttpResponse<IPublier>) => {
          if (publier.body) {
            return of(publier.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default publierResolve;
