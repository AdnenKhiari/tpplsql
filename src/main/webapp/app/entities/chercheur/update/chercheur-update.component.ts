import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ILaboratoire } from 'app/entities/laboratoire/laboratoire.model';
import { LaboratoireService } from 'app/entities/laboratoire/service/laboratoire.service';
import { IFaculte } from 'app/entities/faculte/faculte.model';
import { FaculteService } from 'app/entities/faculte/service/faculte.service';
import { GradeType } from 'app/entities/enumerations/grade-type.model';
import { StatutType } from 'app/entities/enumerations/statut-type.model';
import { ChercheurService } from '../service/chercheur.service';
import { IChercheur } from '../chercheur.model';
import { ChercheurFormService, ChercheurFormGroup } from './chercheur-form.service';

@Component({
  standalone: true,
  selector: 'jhi-chercheur-update',
  templateUrl: './chercheur-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ChercheurUpdateComponent implements OnInit {
  isSaving = false;
  chercheur: IChercheur | null = null;
  gradeTypeValues = Object.keys(GradeType);
  statutTypeValues = Object.keys(StatutType);

  laboratoiresSharedCollection: ILaboratoire[] = [];
  chercheursSharedCollection: IChercheur[] = [];
  facultesSharedCollection: IFaculte[] = [];

  editForm: ChercheurFormGroup = this.chercheurFormService.createChercheurFormGroup();

  constructor(
    protected chercheurService: ChercheurService,
    protected chercheurFormService: ChercheurFormService,
    protected laboratoireService: LaboratoireService,
    protected faculteService: FaculteService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareLaboratoire = (o1: ILaboratoire | null, o2: ILaboratoire | null): boolean => this.laboratoireService.compareLaboratoire(o1, o2);

  compareChercheur = (o1: IChercheur | null, o2: IChercheur | null): boolean => this.chercheurService.compareChercheur(o1, o2);

  compareFaculte = (o1: IFaculte | null, o2: IFaculte | null): boolean => this.faculteService.compareFaculte(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chercheur }) => {
      this.chercheur = chercheur;
      if (chercheur) {
        this.updateForm(chercheur);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const chercheur = this.chercheurFormService.getChercheur(this.editForm);
    if (chercheur.chno !== null) {
      this.subscribeToSaveResponse(this.chercheurService.update(chercheur));
    } else {
      this.subscribeToSaveResponse(this.chercheurService.create(chercheur));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChercheur>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(chercheur: IChercheur): void {
    this.chercheur = chercheur;
    this.chercheurFormService.resetForm(this.editForm, chercheur);

    this.laboratoiresSharedCollection = this.laboratoireService.addLaboratoireToCollectionIfMissing<ILaboratoire>(
      this.laboratoiresSharedCollection,
      chercheur.labno,
    );
    this.chercheursSharedCollection = this.chercheurService.addChercheurToCollectionIfMissing<IChercheur>(
      this.chercheursSharedCollection,
      chercheur.supno,
    );
    this.facultesSharedCollection = this.faculteService.addFaculteToCollectionIfMissing<IFaculte>(
      this.facultesSharedCollection,
      chercheur.facno,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.laboratoireService
      .query()
      .pipe(map((res: HttpResponse<ILaboratoire[]>) => res.body ?? []))
      .pipe(
        map((laboratoires: ILaboratoire[]) =>
          this.laboratoireService.addLaboratoireToCollectionIfMissing<ILaboratoire>(laboratoires, this.chercheur?.labno),
        ),
      )
      .subscribe((laboratoires: ILaboratoire[]) => (this.laboratoiresSharedCollection = laboratoires));

    this.chercheurService
      .query()
      .pipe(map((res: HttpResponse<IChercheur[]>) => res.body ?? []))
      .pipe(
        map((chercheurs: IChercheur[]) =>
          this.chercheurService.addChercheurToCollectionIfMissing<IChercheur>(chercheurs, this.chercheur?.supno),
        ),
      )
      .subscribe((chercheurs: IChercheur[]) => (this.chercheursSharedCollection = chercheurs));

    this.faculteService
      .query()
      .pipe(map((res: HttpResponse<IFaculte[]>) => res.body ?? []))
      .pipe(map((facultes: IFaculte[]) => this.faculteService.addFaculteToCollectionIfMissing<IFaculte>(facultes, this.chercheur?.facno)))
      .subscribe((facultes: IFaculte[]) => (this.facultesSharedCollection = facultes));
  }
}
