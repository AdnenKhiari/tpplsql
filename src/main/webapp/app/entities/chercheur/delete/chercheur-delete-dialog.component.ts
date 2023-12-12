import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IChercheur } from '../chercheur.model';
import { ChercheurService } from '../service/chercheur.service';

@Component({
  standalone: true,
  templateUrl: './chercheur-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ChercheurDeleteDialogComponent {
  chercheur?: IChercheur;

  constructor(
    protected chercheurService: ChercheurService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.chercheurService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
