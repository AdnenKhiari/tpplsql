import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IFaculte } from 'app/entities/faculte/faculte.model';
import { FaculteService } from 'app/entities/faculte/service/faculte.service';
import { ILaboratoire } from '../laboratoire.model';
import { LaboratoireService } from '../service/laboratoire.service';
import { LaboratoireFormService, LaboratoireFormGroup } from './laboratoire-form.service';

@Component({
  standalone: true,
  selector: 'jhi-laboratoire-update',
  templateUrl: './laboratoire-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class LaboratoireUpdateComponent implements OnInit {
  isSaving = false;
  laboratoire: ILaboratoire | null = null;

  facultesSharedCollection: IFaculte[] = [];

  editForm: LaboratoireFormGroup = this.laboratoireFormService.createLaboratoireFormGroup();

  constructor(
    protected laboratoireService: LaboratoireService,
    protected laboratoireFormService: LaboratoireFormService,
    protected faculteService: FaculteService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareFaculte = (o1: IFaculte | null, o2: IFaculte | null): boolean => this.faculteService.compareFaculte(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ laboratoire }) => {
      this.laboratoire = laboratoire;
      if (laboratoire) {
        this.updateForm(laboratoire);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const laboratoire = this.laboratoireFormService.getLaboratoire(this.editForm);
    if (laboratoire.labno !== null) {
      this.subscribeToSaveResponse(this.laboratoireService.update(laboratoire));
    } else {
      this.subscribeToSaveResponse(this.laboratoireService.create(laboratoire));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILaboratoire>>): void {
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

  protected updateForm(laboratoire: ILaboratoire): void {
    this.laboratoire = laboratoire;
    this.laboratoireFormService.resetForm(this.editForm, laboratoire);

    this.facultesSharedCollection = this.faculteService.addFaculteToCollectionIfMissing<IFaculte>(
      this.facultesSharedCollection,
      laboratoire.facno,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.faculteService
      .query()
      .pipe(map((res: HttpResponse<IFaculte[]>) => res.body ?? []))
      .pipe(map((facultes: IFaculte[]) => this.faculteService.addFaculteToCollectionIfMissing<IFaculte>(facultes, this.laboratoire?.facno)))
      .subscribe((facultes: IFaculte[]) => (this.facultesSharedCollection = facultes));
  }
}
