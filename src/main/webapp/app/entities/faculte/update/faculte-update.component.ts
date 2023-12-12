import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IFaculte } from '../faculte.model';
import { FaculteService } from '../service/faculte.service';
import { FaculteFormService, FaculteFormGroup } from './faculte-form.service';

@Component({
  standalone: true,
  selector: 'jhi-faculte-update',
  templateUrl: './faculte-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class FaculteUpdateComponent implements OnInit {
  isSaving = false;
  faculte: IFaculte | null = null;

  editForm: FaculteFormGroup = this.faculteFormService.createFaculteFormGroup();

  constructor(
    protected faculteService: FaculteService,
    protected faculteFormService: FaculteFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ faculte }) => {
      this.faculte = faculte;
      if (faculte) {
        this.updateForm(faculte);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const faculte = this.faculteFormService.getFaculte(this.editForm);
    if (faculte.facno !== null) {
      this.subscribeToSaveResponse(this.faculteService.update(faculte));
    } else {
      this.subscribeToSaveResponse(this.faculteService.create(faculte));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFaculte>>): void {
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

  protected updateForm(faculte: IFaculte): void {
    this.faculte = faculte;
    this.faculteFormService.resetForm(this.editForm, faculte);
  }
}
