import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'chercheur',
    data: { pageTitle: 'Chercheurs' },
    loadChildren: () => import('./chercheur/chercheur.routes'),
  },
  {
    path: 'laboratoire',
    data: { pageTitle: 'Laboratoires' },
    loadChildren: () => import('./laboratoire/laboratoire.routes'),
  },
  {
    path: 'faculte',
    data: { pageTitle: 'Facultes' },
    loadChildren: () => import('./faculte/faculte.routes'),
  },
  {
    path: 'publication',
    data: { pageTitle: 'Publications' },
    loadChildren: () => import('./publication/publication.routes'),
  },
  {
    path: 'publier',
    data: { pageTitle: 'Publiers' },
    loadChildren: () => import('./publier/publier.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
