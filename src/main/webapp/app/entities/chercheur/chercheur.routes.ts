import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ChercheurComponent } from './list/chercheur.component';
import { ChercheurDetailComponent } from './detail/chercheur-detail.component';
import { ChercheurUpdateComponent } from './update/chercheur-update.component';
import ChercheurResolve from './route/chercheur-routing-resolve.service';

const chercheurRoute: Routes = [
  {
    path: '',
    component: ChercheurComponent,
    data: {
      defaultSort: 'chno,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':chno/view',
    component: ChercheurDetailComponent,
    resolve: {
      chercheur: ChercheurResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChercheurUpdateComponent,
    resolve: {
      chercheur: ChercheurResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':chno/edit',
    component: ChercheurUpdateComponent,
    resolve: {
      chercheur: ChercheurResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default chercheurRoute;
