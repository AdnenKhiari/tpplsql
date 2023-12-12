import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PublicationType } from 'app/entities/enumerations/publication-type.model';
import { IPublication } from '../publication.model';
import { PublicationService } from '../service/publication.service';
import { PublicationFormService, PublicationFormGroup } from './publication-form.service';

@Component({
  standalone: true,
  selector: 'jhi-publication-update',
  templateUrl: './publication-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PublicationUpdateComponent implements OnInit {
  isSaving = false;
  publication: IPublication | null = null;
  publicationTypeValues = Object.keys(PublicationType);

  editForm: PublicationFormGroup = this.publicationFormService.createPublicationFormGroup();

  constructor(
    protected publicationService: PublicationService,
    protected publicationFormService: PublicationFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ publication }) => {
      this.publication = publication;
      if (publication) {
        this.updateForm(publication);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const publication = this.publicationFormService.getPublication(this.editForm);
    if (publication.pubno !== null) {
      this.subscribeToSaveResponse(this.publicationService.update(publication));
    } else {
      this.subscribeToSaveResponse(this.publicationService.create(publication));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPublication>>): void {
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

  protected updateForm(publication: IPublication): void {
    this.publication = publication;
    this.publicationFormService.resetForm(this.editForm, publication);
  }
}
