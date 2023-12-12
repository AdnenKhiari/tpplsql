import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FaculteService } from '../service/faculte.service';
import { IFaculte } from '../faculte.model';
import { FaculteFormService } from './faculte-form.service';

import { FaculteUpdateComponent } from './faculte-update.component';

describe('Faculte Management Update Component', () => {
  let comp: FaculteUpdateComponent;
  let fixture: ComponentFixture<FaculteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let faculteFormService: FaculteFormService;
  let faculteService: FaculteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), FaculteUpdateComponent],
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
      .overrideTemplate(FaculteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FaculteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    faculteFormService = TestBed.inject(FaculteFormService);
    faculteService = TestBed.inject(FaculteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const faculte: IFaculte = { facno: 456 };

      activatedRoute.data = of({ faculte });
      comp.ngOnInit();

      expect(comp.faculte).toEqual(faculte);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFaculte>>();
      const faculte = { facno: 123 };
      jest.spyOn(faculteFormService, 'getFaculte').mockReturnValue(faculte);
      jest.spyOn(faculteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ faculte });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: faculte }));
      saveSubject.complete();

      // THEN
      expect(faculteFormService.getFaculte).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(faculteService.update).toHaveBeenCalledWith(expect.objectContaining(faculte));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFaculte>>();
      const faculte = { facno: 123 };
      jest.spyOn(faculteFormService, 'getFaculte').mockReturnValue({ facno: null });
      jest.spyOn(faculteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ faculte: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: faculte }));
      saveSubject.complete();

      // THEN
      expect(faculteFormService.getFaculte).toHaveBeenCalled();
      expect(faculteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFaculte>>();
      const faculte = { facno: 123 };
      jest.spyOn(faculteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ faculte });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(faculteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
