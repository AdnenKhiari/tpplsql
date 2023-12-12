import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { LaboratoireComponent } from './list/laboratoire.component';
import { LaboratoireDetailComponent } from './detail/laboratoire-detail.component';
import { LaboratoireUpdateComponent } from './update/laboratoire-update.component';
import LaboratoireResolve from './route/laboratoire-routing-resolve.service';

const laboratoireRoute: Routes = [
  {
    path: '',
    component: LaboratoireComponent,
    data: {
      defaultSort: 'labno,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':labno/view',
    component: LaboratoireDetailComponent,
    resolve: {
      laboratoire: LaboratoireResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LaboratoireUpdateComponent,
    resolve: {
      laboratoire: LaboratoireResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':labno/edit',
    component: LaboratoireUpdateComponent,
    resolve: {
      laboratoire: LaboratoireResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default laboratoireRoute;
