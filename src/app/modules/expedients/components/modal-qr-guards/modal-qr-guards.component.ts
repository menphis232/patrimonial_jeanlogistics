import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExpedientsService } from '../../services/expedients.service';

@Component({
  selector: 'app-modal-qr-guards-expedients',
  templateUrl: './modal-qr-guards.component.html',
  styleUrls: ['./modal-qr-guards.component.scss']
})
export class ModalQrGuardsComponent implements OnInit {
  patient: any = null;
  qr: string | null = null;
  id: any;

  constructor(
    public dialog: MatDialog,
    private _expedientService: ExpedientsService,
    public dialogRef: MatDialogRef<ModalQrGuardsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = data?.farm ?? data?.id;
  }

  ngOnInit(): void {
    if (this.id != null) {
      this._expedientService.showArea(String(this.id)).subscribe({
        next: (res: any) => {
          const area = res?.data ?? res;
          this.patient = area;
          const qrCode = area?.qr;
          if (qrCode) {
            const qrStr = String(qrCode);
            this.qr = qrStr.startsWith('data:') ? qrStr : `data:image/png;base64,${qrStr}`;
          }
        }
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
