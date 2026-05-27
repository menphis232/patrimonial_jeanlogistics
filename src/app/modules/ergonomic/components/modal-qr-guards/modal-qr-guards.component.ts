import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErgonomicService } from '../../services/ergonomic.service';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-modal-qr-guards-ergonomic',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title class="f-w-500 m-b-24">
      <strong>{{ (patient == null ? null : patient.name) || 'Cargando…' }}</strong>
    </h2>

    <mat-dialog-content style="max-width: 800px;">
      <ng-container *ngIf="patient; else loadingPatient">
        <div class="row">
          <div class="col-sm-12 col-md-12 m-t-20">
            <div class="d-flex flex-column">
              <img *ngIf="qr" [src]="qr" alt="Código QR del área" />
              <p *ngIf="!qr" class="text-muted">No hay imagen QR disponible para esta área.</p>
            </div>
          </div>
        </div>
      </ng-container>

      <ng-template #loadingPatient>
        <div class="patient-loading">
          <mat-icon class="icon-40">search</mat-icon>
          <div class="patient-loading__title">Cargando código qr... </div>
        </div>
      </ng-template>
    </mat-dialog-content>

    <div mat-dialog-actions class="p-x-24 p-b-24">
      <div class="w-100 d-flex justify-content-end">
        <button mat-flat-button color="warn" (click)="closeDialog()">Cerrar</button>
      </div>
    </div>
  `,
  styles: [`
    .patient-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }
    .patient-loading__title {
      margin-top: 12px;
      color: #666;
    }
    img {
      max-width: 100%;
      border-radius: 8px;
    }
    .icon-40 {
      font-size: 40px;
      width: 40px;
      height: 40px;
    }
  `]
})
export class ModalQrGuardsComponent implements OnInit {
  patient: any = null;
  qr: string | null = null;
  id: any;

  constructor(
    public dialogRef: MatDialogRef<ModalQrGuardsComponent>,
    private _patientService: ErgonomicService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = data?.farm ?? data?.id;
  }

  ngOnInit(): void {
    if (this.id != null) {
      this._patientService.showArea(String(this.id)).subscribe({
        next: (response: any) => {
          const p = response?.data ?? response;
          this.patient = p;
          const qrValue = p?.qr;
          if (qrValue) {
            const qrStr = String(qrValue);
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
