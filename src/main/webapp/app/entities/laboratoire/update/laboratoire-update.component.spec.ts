import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IFaculte } from 'app/entities/faculte/faculte.model';
import { FaculteService } from 'app/entities/faculte/service/faculte.service';
import { LaboratoireService } from '../service/laboratoire.service';
import { ILaboratoire } from '../laboratoire.model';
import { LaboratoireFormService } from './laboratoire-form.service';

import { LaboratoireUpdateComponent } from './laboratoire-update.component';

describe('Laboratoire Management Update Component', () => {
  let comp: LaboratoireUpdateComponent;
  let fixture: ComponentFixture<LaboratoireUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let laboratoireFormService: LaboratoireFormService;
  let laboratoireService: LaboratoireService;
  let faculteService: FaculteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), LaboratoireUpdateComponent],
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
      .overrideTemplate(LaboratoireUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LaboratoireUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    laboratoireFormService = TestBed.inject(LaboratoireFormService);
    laboratoireService = TestBed.inject(LaboratoireService);
    faculteService = TestBed.inject(FaculteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Faculte query and add missing value', () => {
      const laboratoire: ILaboratoire = { labno: 456 };
      const facno: IFaculte = { facno: 14775 };
      laboratoire.facno = facno;

      const faculteCollection: IFaculte[] = [{ facno: 7789 }];
      jest.spyOn(faculteService, 'query').mockReturnValue(of(new HttpResponse({ body: faculteCollection })));
      const additionalFacultes = [facno];
      const expectedCollection: IFaculte[] = [...additionalFacultes, ...faculteCollection];
      jest.spyOn(faculteService, 'addFaculteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ laboratoire });
      comp.ngOnInit();

      expect(faculteService.query).toHaveBeenCalled();
      expect(faculteService.addFaculteToCollectionIfMissing).toHaveBeenCalledWith(
        faculteCollection,
        ...additionalFacultes.map(expect.objectContaining),
      );
      expect(comp.facultesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const laboratoire: ILaboratoire = { labno: 456 };
      const facno: IFaculte = { facno: 13580 };
      laboratoire.facno = facno;

      activatedRoute.data = of({ laboratoire });
      comp.ngOnInit();

      expect(comp.facultesSharedCollection).toContain(facno);
      expect(comp.laboratoire).toEqual(laboratoire);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILaboratoire>>();
      const laboratoire = { labno: 123 };
      jest.spyOn(laboratoireFormService, 'getLaboratoire').mockReturnValue(laboratoire);
      jest.spyOn(laboratoireService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ laboratoire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: laboratoire }));
      saveSubject.complete();

      // THEN
      expect(laboratoireFormService.getLaboratoire).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(laboratoireService.update).toHaveBeenCalledWith(expect.objectContaining(laboratoire));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILaboratoire>>();
      const laboratoire = { labno: 123 };
      jest.spyOn(laboratoireFormService, 'getLaboratoire').mockReturnValue({ labno: null });
      jest.spyOn(laboratoireService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ laboratoire: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: laboratoire }));
      saveSubject.complete();

      // THEN
      expect(laboratoireFormService.getLaboratoire).toHaveBeenCalled();
      expect(laboratoireService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILaboratoire>>();
      const laboratoire = { labno: 123 };
      jest.spyOn(laboratoireService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ laboratoire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(laboratoireService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
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
