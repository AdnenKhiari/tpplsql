import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPublier } from '../publier.model';
import { PublierService } from '../service/publier.service';

@Component({
  standalone: true,
  templateUrl: './publier-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PublierDeleteDialogComponent {
  publier?: IPublier;

  constructor(
    protected publierService: PublierService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.publierService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
