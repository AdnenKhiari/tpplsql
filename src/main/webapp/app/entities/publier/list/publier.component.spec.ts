import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PublierService } from '../service/publier.service';

import { PublierComponent } from './publier.component';

describe('Publier Management Component', () => {
  let comp: PublierComponent;
  let fixture: ComponentFixture<PublierComponent>;
  let service: PublierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'publier', component: PublierComponent }]),
        HttpClientTestingModule,
        PublierComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'pubId,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'pubId,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(PublierComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PublierComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PublierService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ pubId: 123 }],
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
    expect(comp.publiers?.[0]).toEqual(expect.objectContaining({ pubId: 123 }));
  });

  describe('trackPubId', () => {
    it('Should forward to publierService', () => {
      const entity = { pubId: 123 };
      jest.spyOn(service, 'getPublierIdentifier');
      const pubId = comp.trackPubId(0, entity);
      expect(service.getPublierIdentifier).toHaveBeenCalledWith(entity);
      expect(pubId).toBe(entity.pubId);
    });
  });
});
