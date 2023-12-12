import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PublicationService } from '../service/publication.service';

import { PublicationComponent } from './publication.component';

describe('Publication Management Component', () => {
  let comp: PublicationComponent;
  let fixture: ComponentFixture<PublicationComponent>;
  let service: PublicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'publication', component: PublicationComponent }]),
        HttpClientTestingModule,
        PublicationComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'pubno,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'pubno,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(PublicationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PublicationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PublicationService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ pubno: 123 }],
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
    expect(comp.publications?.[0]).toEqual(expect.objectContaining({ pubno: 123 }));
  });

  describe('trackPubno', () => {
    it('Should forward to publicationService', () => {
      const entity = { pubno: 123 };
      jest.spyOn(service, 'getPublicationIdentifier');
      const pubno = comp.trackPubno(0, entity);
      expect(service.getPublicationIdentifier).toHaveBeenCalledWith(entity);
      expect(pubno).toBe(entity.pubno);
    });
  });
});
