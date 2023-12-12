import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FaculteService } from '../service/faculte.service';

import { FaculteComponent } from './faculte.component';

describe('Faculte Management Component', () => {
  let comp: FaculteComponent;
  let fixture: ComponentFixture<FaculteComponent>;
  let service: FaculteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'faculte', component: FaculteComponent }]),
        HttpClientTestingModule,
        FaculteComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'facno,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'facno,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(FaculteComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FaculteComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FaculteService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ facno: 123 }],
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
    expect(comp.facultes?.[0]).toEqual(expect.objectContaining({ facno: 123 }));
  });

  describe('trackFacno', () => {
    it('Should forward to faculteService', () => {
      const entity = { facno: 123 };
      jest.spyOn(service, 'getFaculteIdentifier');
      const facno = comp.trackFacno(0, entity);
      expect(service.getFaculteIdentifier).toHaveBeenCalledWith(entity);
      expect(facno).toBe(entity.facno);
    });
  });
});
