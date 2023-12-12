import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IPublication } from 'app/entities/publication/publication.model';
import { PublicationService } from 'app/entities/publication/service/publication.service';
import { IChercheur } from 'app/entities/chercheur/chercheur.model';
import { ChercheurService } from 'app/entities/chercheur/service/chercheur.service';
import { PublierService } from '../service/publier.service';
import { IPublier } from '../publier.model';
import { PublierFormService, PublierFormGroup } from './publier-form.service';

@Component({
  standalone: true,
  selector: 'jhi-publier-update',
  templateUrl: './publier-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PublierUpdateComponent implements OnInit {
  isSaving = false;
  publier: IPublier | null = null;

  publicationsSharedCollection: IPublication[] = [];
  chercheursSharedCollection: IChercheur[] = [];

  editForm: PublierFormGroup = this.publierFormService.createPublierFormGroup();

  constructor(
    protected publierService: PublierService,
    protected publierFormService: PublierFormService,
    protected publicationService: PublicationService,
    protected chercheurService: ChercheurService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  comparePublication = (o1: IPublication | null, o2: IPublication | null): boolean => this.publicationService.comparePublication(o1, o2);

  compareChercheur = (o1: IChercheur | null, o2: IChercheur | null): boolean => this.chercheurService.compareChercheur(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ publier }) => {
      this.publier = publier;
      if (publier) {
        this.updateForm(publier);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const publier = this.publierFormService.getPublier(this.editForm);
    if (publier.pubId !== null) {
      this.subscribeToSaveResponse(this.publierService.update(publier));
    } else {
      this.subscribeToSaveResponse(this.publierService.create(publier));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPublier>>): void {
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

  protected updateForm(publier: IPublier): void {
    this.publier = publier;
    this.publierFormService.resetForm(this.editForm, publier);

    this.publicationsSharedCollection = this.publicationService.addPublicationToCollectionIfMissing<IPublication>(
      this.publicationsSharedCollection,
      publier.pubno,
    );
    this.chercheursSharedCollection = this.chercheurService.addChercheurToCollectionIfMissing<IChercheur>(
      this.chercheursSharedCollection,
      publier.chno,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.publicationService
      .query()
      .pipe(map((res: HttpResponse<IPublication[]>) => res.body ?? []))
      .pipe(
        map((publications: IPublication[]) =>
          this.publicationService.addPublicationToCollectionIfMissing<IPublication>(publications, this.publier?.pubno),
        ),
      )
      .subscribe((publications: IPublication[]) => (this.publicationsSharedCollection = publications));

    this.chercheurService
      .query()
      .pipe(map((res: HttpResponse<IChercheur[]>) => res.body ?? []))
      .pipe(
        map((chercheurs: IChercheur[]) =>
          this.chercheurService.addChercheurToCollectionIfMissing<IChercheur>(chercheurs, this.publier?.chno),
        ),
      )
      .subscribe((chercheurs: IChercheur[]) => (this.chercheursSharedCollection = chercheurs));
  }
}
