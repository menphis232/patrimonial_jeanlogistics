import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-modal-qr-guards-category',
  templateUrl: './modal-qr-guards.component.html',
  styleUrls: ['./modal-qr-guards.component.scss'],
  standalone: true,
  imports: [CommonModule, MaterialModule, SharedModule]
})
export class ModalQrGuardsComponent implements OnInit {
  id: any;
  patient: any = null;
  qr: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<ModalQrGuardsComponent>,
    private _categoryService: CategoryService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = data?.id;
    const qrData = data?.qr;
    if (qrData) {
      const qrStr = String(qrData);
      this.qr = qrStr.startsWith('data:') ? qrStr : `data:image/png;base64,${qrStr}`;
    }
  }

  get guardTitle(): string {
    if (!this.patient) return 'Cargando…';
    const first = this.patient.first_name ?? '';
    const last = this.patient.last_name ?? '';
    return `${first} ${last}`.trim() || 'Guardia de seguridad';
  }

  ngOnInit(): void {
    this._categoryService.show(this.id).subscribe({
      next: (t: any) => {
        const guard = t?.data ?? t;
        this.patient = guard;
        // El endpoint de lista devuelve qr=null intencionalmente.
        // El endpoint de detalle (show) sí genera el QR; lo extraemos aquí.
        if (guard?.qr) {
          const qrStr = String(guard.qr);
          this.qr = qrStr.startsWith('data:') ? qrStr : `data:image/png;base64,${qrStr}`;
        }
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
