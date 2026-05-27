import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ExpedientsService } from '../../services/expedients.service';

@Component({
  selector: 'app-modal-detail-tours',
  templateUrl: './modal-detail-tours.component.html',
  styleUrls: ['./modal-detail-tours.component.scss']
})
export class ModalDetailToursComponent implements OnInit {
  patient: any = null;
  qr: string = '';
  id: any;

  constructor(
    public dialog: MatDialog,
    public sanitizer: DomSanitizer,
    private _patientService: ExpedientsService,
    public dialogRef: MatDialogRef<ModalDetailToursComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = data.farm;
  }

  ngOnInit(): void {
    this._patientService.show(this.id).subscribe(res => {
      this.patient = res;
      this.qr = `data:image/png;base64,${res.qr}`;
    });
  }

  closeDialog(): void {
    this.dialogRef.close({
      event: 'Cancel'
    });
  }

  convertir(seconds: number): string {
    if (!seconds) return '0 segundos';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds / 60) % 60);
    const secs = Math.round(seconds % 60);
    return `${hrs} horas, ${mins} minutos y ${secs} segundos.`;
  }

  generateLink(lat: any, long: any): string {
    const link = `https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3489.315155928166!2d${long}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjnCsDAwJzI3LjYiTiAxMTDCsDU0JzQ5LjUiVw!5e0!3m2!1ses!2sve!4v1715030793577!5m2!1ses!2sve`;
    console.log('respuesta', link);
    return link;
  }

  rutaMapa(lat: any, long: any): string {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${long}`;
  }
}
