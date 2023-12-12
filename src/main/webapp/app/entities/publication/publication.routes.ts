import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { PublicationComponent } from './list/publication.component';
import { PublicationDetailComponent } from './detail/publication-detail.component';
import { PublicationUpdateComponent } from './update/publication-update.component';
import PublicationResolve from './route/publication-routing-resolve.service';

const publicationRoute: Routes = [
  {
    path: '',
    component: PublicationComponent,
    data: {
      defaultSort: 'pubno,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':pubno/view',
    component: PublicationDetailComponent,
    resolve: {
      publication: PublicationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PublicationUpdateComponent,
    resolve: {
      publication: PublicationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':pubno/edit',
    component: PublicationUpdateComponent,
    resolve: {
      publication: PublicationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default publicationRoute;
