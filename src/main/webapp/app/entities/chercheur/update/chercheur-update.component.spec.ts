import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ILaboratoire } from 'app/entities/laboratoire/laboratoire.model';
import { LaboratoireService } from 'app/entities/laboratoire/service/laboratoire.service';
import { IFaculte } from 'app/entities/faculte/faculte.model';
import { FaculteService } from 'app/entities/faculte/service/faculte.service';
import { IChercheur } from '../chercheur.model';
import { ChercheurService } from '../service/chercheur.service';
import { ChercheurFormService } from './chercheur-form.service';

import { ChercheurUpdateComponent } from './chercheur-update.component';

describe('Chercheur Management Update Component', () => {
  let comp: ChercheurUpdateComponent;
  let fixture: ComponentFixture<ChercheurUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let chercheurFormService: ChercheurFormService;
  let chercheurService: ChercheurService;
  let laboratoireService: LaboratoireService;
  let faculteService: FaculteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ChercheurUpdateComponent],
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
      .overrideTemplate(ChercheurUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChercheurUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    chercheurFormService = TestBed.inject(ChercheurFormService);
    chercheurService = TestBed.inject(ChercheurService);
    laboratoireService = TestBed.inject(LaboratoireService);
    faculteService = TestBed.inject(FaculteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Laboratoire query and add missing value', () => {
      const chercheur: IChercheur = { chno: 456 };
      const labno: ILaboratoire = { labno: 12610 };
      chercheur.labno = labno;

      const laboratoireCollection: ILaboratoire[] = [{ labno: 19647 }];
      jest.spyOn(laboratoireService, 'query').mockReturnValue(of(new HttpResponse({ body: laboratoireCollection })));
      const additionalLaboratoires = [labno];
      const expectedCollection: ILaboratoire[] = [...additionalLaboratoires, ...laboratoireCollection];
      jest.spyOn(laboratoireService, 'addLaboratoireToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chercheur });
      comp.ngOnInit();

      expect(laboratoireService.query).toHaveBeenCalled();
      expect(laboratoireService.addLaboratoireToCollectionIfMissing).toHaveBeenCalledWith(
        laboratoireCollection,
        ...additionalLaboratoires.map(expect.objectContaining),
      );
      expect(comp.laboratoiresSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Chercheur query and add missing value', () => {
      const chercheur: IChercheur = { chno: 456 };
      const supno: IChercheur = { chno: 6740 };
      chercheur.supno = supno;

      const chercheurCollection: IChercheur[] = [{ chno: 8300 }];
      jest.spyOn(chercheurService, 'query').mockReturnValue(of(new HttpResponse({ body: chercheurCollection })));
      const additionalChercheurs = [supno];
      const expectedCollection: IChercheur[] = [...additionalChercheurs, ...chercheurCollection];
      jest.spyOn(chercheurService, 'addChercheurToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chercheur });
      comp.ngOnInit();

      expect(chercheurService.query).toHaveBeenCalled();
      expect(chercheurService.addChercheurToCollectionIfMissing).toHaveBeenCalledWith(
        chercheurCollection,
        ...additionalChercheurs.map(expect.objectContaining),
      );
      expect(comp.chercheursSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Faculte query and add missing value', () => {
      const chercheur: IChercheur = { chno: 456 };
      const facno: IFaculte = { facno: 15943 };
      chercheur.facno = facno;

      const faculteCollection: IFaculte[] = [{ facno: 8098 }];
      jest.spyOn(faculteService, 'query').mockReturnValue(of(new HttpResponse({ body: faculteCollection })));
      const additionalFacultes = [facno];
      const expectedCollection: IFaculte[] = [...additionalFacultes, ...faculteCollection];
      jest.spyOn(faculteService, 'addFaculteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chercheur });
      comp.ngOnInit();

      expect(faculteService.query).toHaveBeenCalled();
      expect(faculteService.addFaculteToCollectionIfMissing).toHaveBeenCalledWith(
        faculteCollection,
        ...additionalFacultes.map(expect.objectContaining),
      );
      expect(comp.facultesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const chercheur: IChercheur = { chno: 456 };
      const labno: ILaboratoire = { labno: 33 };
      chercheur.labno = labno;
      const supno: IChercheur = { chno: 14358 };
      chercheur.supno = supno;
      const facno: IFaculte = { facno: 25904 };
      chercheur.facno = facno;

      activatedRoute.data = of({ chercheur });
      comp.ngOnInit();

      expect(comp.laboratoiresSharedCollection).toContain(labno);
      expect(comp.chercheursSharedCollection).toContain(supno);
      expect(comp.facultesSharedCollection).toContain(facno);
      expect(comp.chercheur).toEqual(chercheur);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChercheur>>();
      const chercheur = { chno: 123 };
      jest.spyOn(chercheurFormService, 'getChercheur').mockReturnValue(chercheur);
      jest.spyOn(chercheurService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chercheur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chercheur }));
      saveSubject.complete();

      // THEN
      expect(chercheurFormService.getChercheur).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(chercheurService.update).toHaveBeenCalledWith(expect.objectContaining(chercheur));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChercheur>>();
      const chercheur = { chno: 123 };
      jest.spyOn(chercheurFormService, 'getChercheur').mockReturnValue({ chno: null });
      jest.spyOn(chercheurService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chercheur: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chercheur }));
      saveSubject.complete();

      // THEN
      expect(chercheurFormService.getChercheur).toHaveBeenCalled();
      expect(chercheurService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChercheur>>();
      const chercheur = { chno: 123 };
      jest.spyOn(chercheurService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chercheur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(chercheurService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareLaboratoire', () => {
      it('Should forward to laboratoireService', () => {
        const entity = { labno: 123 };
        const entity2 = { labno: 456 };
        jest.spyOn(laboratoireService, 'compareLaboratoire');
        comp.compareLaboratoire(entity, entity2);
        expect(laboratoireService.compareLaboratoire).toHaveBeenCalledWith(entity, entity2);
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

    describe('compareFaculte', () => {
      it('Should forward to faculteService', () => {
        const entity = { facno: 123 };
        const entity2 = { facno: 456 };
        jest.spyOn(faculteService, 'compareFaculte');
        comp.compareFaculte(entity, entity2);
        expect(faculteService.compareFaculte).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
