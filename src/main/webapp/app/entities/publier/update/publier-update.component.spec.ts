import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IPublication } from 'app/entities/publication/publication.model';
import { PublicationService } from 'app/entities/publication/service/publication.service';
import { IChercheur } from 'app/entities/chercheur/chercheur.model';
import { ChercheurService } from 'app/entities/chercheur/service/chercheur.service';
import { IPublier } from '../publier.model';
import { PublierService } from '../service/publier.service';
import { PublierFormService } from './publier-form.service';

import { PublierUpdateComponent } from './publier-update.component';

describe('Publier Management Update Component', () => {
  let comp: PublierUpdateComponent;
  let fixture: ComponentFixture<PublierUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let publierFormService: PublierFormService;
  let publierService: PublierService;
  let publicationService: PublicationService;
  let chercheurService: ChercheurService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), PublierUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PublierUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PublierUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    publierFormService = TestBed.inject(PublierFormService);
    publierService = TestBed.inject(PublierService);
    publicationService = TestBed.inject(PublicationService);
    chercheurService = TestBed.inject(ChercheurService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Publication query and add missing value', () => {
      const publier: IPublier = { pubId: 456 };
      const pubno: IPublication = { pubno: 22557 };
      publier.pubno = pubno;

      const publicationCollection: IPublication[] = [{ pubno: 684 }];
      jest.spyOn(publicationService, 'query').mockReturnValue(of(new HttpResponse({ body: publicationCollection })));
      const additionalPublications = [pubno];
      const expectedCollection: IPublication[] = [...additionalPublications, ...publicationCollection];
      jest.spyOn(publicationService, 'addPublicationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ publier });
      comp.ngOnInit();

      expect(publicationService.query).toHaveBeenCalled();
      expect(publicationService.addPublicationToCollectionIfMissing).toHaveBeenCalledWith(
        publicationCollection,
        ...additionalPublications.map(expect.objectContaining),
      );
      expect(comp.publicationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Chercheur query and add missing value', () => {
      const publier: IPublier = { pubId: 456 };
      const chno: IChercheur = { chno: 7706 };
      publier.chno = chno;

      const chercheurCollection: IChercheur[] = [{ chno: 10701 }];
      jest.spyOn(chercheurService, 'query').mockReturnValue(of(new HttpResponse({ body: chercheurCollection })));
      const additionalChercheurs = [chno];
      const expectedCollection: IChercheur[] = [...additionalChercheurs, ...chercheurCollection];
      jest.spyOn(chercheurService, 'addChercheurToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ publier });
      comp.ngOnInit();

      expect(chercheurService.query).toHaveBeenCalled();
      expect(chercheurService.addChercheurToCollectionIfMissing).toHaveBeenCalledWith(
        chercheurCollection,
        ...additionalChercheurs.map(expect.objectContaining),
      );
      expect(comp.chercheursSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const publier: IPublier = { pubId: 456 };
      const pubno: IPublication = { pubno: 27672 };
      publier.pubno = pubno;
      const chno: IChercheur = { chno: 19215 };
      publier.chno = chno;

      activatedRoute.data = of({ publier });
      comp.ngOnInit();

      expect(comp.publicationsSharedCollection).toContain(pubno);
      expect(comp.chercheursSharedCollection).toContain(chno);
      expect(comp.publier).toEqual(publier);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPublier>>();
      const publier = { pubId: 123 };
      jest.spyOn(publierFormService, 'getPublier').mockReturnValue(publier);
      jest.spyOn(publierService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ publier });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: publier }));
      saveSubject.complete();

      // THEN
      expect(publierFormService.getPublier).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(publierService.update).toHaveBeenCalledWith(expect.objectContaining(publier));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPublier>>();
      const publier = { pubId: 123 };
      jest.spyOn(publierFormService, 'getPublier').mockReturnValue({ pubId: null });
      jest.spyOn(publierService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ publier: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: publier }));
      saveSubject.complete();

      // THEN
      expect(publierFormService.getPublier).toHaveBeenCalled();
      expect(publierService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPublier>>();
      const publier = { pubId: 123 };
      jest.spyOn(publierService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ publier });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(publierService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePublication', () => {
      it('Should forward to publicationService', () => {
        const entity = { pubno: 123 };
        const entity2 = { pubno: 456 };
        jest.spyOn(publicationService, 'comparePublication');
        comp.comparePublication(entity, entity2);
        expect(publicationService.comparePublication).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareChercheur', () => {
      it('Should forward to chercheurService', () => {
        const entity = { chno: 123 };
        const entity2 = { chno: 456 };
        jest.spyOn(chercheurService, 'compareChercheur');
        comp.compareChercheur(entity, entity2);
        expect(chercheurService.compareChercheur).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
