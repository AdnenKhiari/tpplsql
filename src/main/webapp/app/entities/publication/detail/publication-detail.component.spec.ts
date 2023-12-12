import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PublicationDetailComponent } from './publication-detail.component';

describe('Publication Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicationDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: PublicationDetailComponent,
              resolve: { publication: () => of({ pubno: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PublicationDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load publication on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PublicationDetailComponent);

      // THEN
      expect(instance.publication).toEqual(expect.objectContaining({ pubno: 123 }));
    });
  });
});
