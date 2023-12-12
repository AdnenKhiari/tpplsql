import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { FaculteComponent } from './list/faculte.component';
import { FaculteDetailComponent } from './detail/faculte-detail.component';
import { FaculteUpdateComponent } from './update/faculte-update.component';
import FaculteResolve from './route/faculte-routing-resolve.service';

const faculteRoute: Routes = [
  {
    path: '',
    component: FaculteComponent,
    data: {
      defaultSort: 'facno,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':facno/view',
    component: FaculteDetailComponent,
    resolve: {
      faculte: FaculteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FaculteUpdateComponent,
    resolve: {
      faculte: FaculteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':facno/edit',
    component: FaculteUpdateComponent,
    resolve: {
      faculte: FaculteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default faculteRoute;
