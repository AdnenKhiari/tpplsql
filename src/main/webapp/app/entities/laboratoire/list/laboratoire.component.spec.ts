import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LaboratoireService } from '../service/laboratoire.service';

import { LaboratoireComponent } from './laboratoire.component';

describe('Laboratoire Management Component', () => {
  let comp: LaboratoireComponent;
  let fixture: ComponentFixture<LaboratoireComponent>;
  let service: LaboratoireService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'laboratoire', component: LaboratoireComponent }]),
        HttpClientTestingModule,
        LaboratoireComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'labno,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'labno,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(LaboratoireComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LaboratoireComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LaboratoireService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ labno: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.laboratoires?.[0]).toEqual(expect.objectContaining({ labno: 123 }));
  });

  describe('trackLabno', () => {
    it('Should forward to laboratoireService', () => {
      const entity = { labno: 123 };
      jest.spyOn(service, 'getLaboratoireIdentifier');
      const labno = comp.trackLabno(0, entity);
      expect(service.getLaboratoireIdentifier).toHaveBeenCalledWith(entity);
      expect(labno).toBe(entity.labno);
    });
  });
});
