import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LaboratoireDetailComponent } from './laboratoire-detail.component';

describe('Laboratoire Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaboratoireDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: LaboratoireDetailComponent,
              resolve: { laboratoire: () => of({ labno: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(LaboratoireDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load laboratoire on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', LaboratoireDetailComponent);

      // THEN
      expect(instance.laboratoire).toEqual(expect.objectContaining({ labno: 123 }));
    });
  });
});
