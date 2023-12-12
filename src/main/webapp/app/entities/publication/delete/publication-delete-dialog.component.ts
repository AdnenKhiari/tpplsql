import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPublication } from '../publication.model';
import { PublicationService } from '../service/publication.service';

@Component({
  standalone: true,
  templateUrl: './publication-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PublicationDeleteDialogComponent {
  publication?: IPublication;

  constructor(
    protected publicationService: PublicationService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.publicationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
