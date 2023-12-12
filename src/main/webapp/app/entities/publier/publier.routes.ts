import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { PublierComponent } from './list/publier.component';
import { PublierDetailComponent } from './detail/publier-detail.component';
import { PublierUpdateComponent } from './update/publier-update.component';
import PublierResolve from './route/publier-routing-resolve.service';

const publierRoute: Routes = [
  {
    path: '',
    component: PublierComponent,
    data: {
      defaultSort: 'pubId,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':pubId/view',
    component: PublierDetailComponent,
    resolve: {
      publier: PublierResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PublierUpdateComponent,
    resolve: {
      publier: PublierResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':pubId/edit',
    component: PublierUpdateComponent,
    resolve: {
      publier: PublierResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default publierRoute;
