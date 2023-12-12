import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FaculteDetailComponent } from './faculte-detail.component';

describe('Faculte Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaculteDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: FaculteDetailComponent,
              resolve: { faculte: () => of({ facno: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(FaculteDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load faculte on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', FaculteDetailComponent);

      // THEN
      expect(instance.faculte).toEqual(expect.objectContaining({ facno: 123 }));
    });
  });
});
