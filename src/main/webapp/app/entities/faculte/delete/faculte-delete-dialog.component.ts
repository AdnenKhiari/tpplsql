import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IFaculte } from '../faculte.model';
import { FaculteService } from '../service/faculte.service';

@Component({
  standalone: true,
  templateUrl: './faculte-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class FaculteDeleteDialogComponent {
  faculte?: IFaculte;

  constructor(
    protected faculteService: FaculteService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.faculteService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
