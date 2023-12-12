import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PublierDetailComponent } from './publier-detail.component';

describe('Publier Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublierDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: PublierDetailComponent,
              resolve: { publier: () => of({ pubId: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PublierDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load publier on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PublierDetailComponent);

      // THEN
      expect(instance.publier).toEqual(expect.objectContaining({ pubId: 123 }));
    });
  });
});
