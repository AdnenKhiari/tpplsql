import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ChercheurService } from '../service/chercheur.service';

import { ChercheurComponent } from './chercheur.component';

describe('Chercheur Management Component', () => {
  let comp: ChercheurComponent;
  let fixture: ComponentFixture<ChercheurComponent>;
  let service: ChercheurService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'chercheur', component: ChercheurComponent }]),
        HttpClientTestingModule,
        ChercheurComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'chno,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'chno,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ChercheurComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChercheurComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ChercheurService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ chno: 123 }],
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
    expect(comp.chercheurs?.[0]).toEqual(expect.objectContaining({ chno: 123 }));
  });

  describe('trackChno', () => {
    it('Should forward to chercheurService', () => {
      const entity = { chno: 123 };
      jest.spyOn(service, 'getChercheurIdentifier');
      const chno = comp.trackChno(0, entity);
      expect(service.getChercheurIdentifier).toHaveBeenCalledWith(entity);
      expect(chno).toBe(entity.chno);
    });
  });
});
