import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ChercheurDetailComponent } from './chercheur-detail.component';

describe('Chercheur Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChercheurDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ChercheurDetailComponent,
              resolve: { chercheur: () => of({ chno: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ChercheurDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load chercheur on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ChercheurDetailComponent);

      // THEN
      expect(instance.chercheur).toEqual(expect.objectContaining({ chno: 123 }));
    });
  });
});
