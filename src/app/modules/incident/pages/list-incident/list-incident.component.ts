import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { ConfirmationService } from 'src/app/shared/services/confirmation/confirmation.service';
import { IncidentService } from '../../services/incident.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ModalDetailIncidentComponent } from '../../components/modal-detail-incident/modal-detail-incident.component';
import { saveAs } from 'file-saver';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-list-incident',
  templateUrl: './list-incident.component.html',
  styleUrls: ['./list-incident.component.scss']
})
export class ListIncidentComponent implements OnInit {

  @ViewChild(MatPaginator) private paginator: MatPaginator;

  public pagination: MatPagination = new MatPagination;

  public displayedColumns: string[] = [
    'folio',
    'folioComplaint',
    'folioIncidence',
    'farm',
    'name',
    // 'turn',
    'eventDate',
    'status',
    'place',
    'microBusiness',
    'measurement',
    'lostMoney',
    'actions'
  ];

  constructor(
    public dialog: MatDialog,
    private _incidentService: IncidentService,
    private _confirmation: ConfirmationService,
    private activatedRoute: ActivatedRoute,
  ) {}

  get collaborators$(): Observable<any[]> {
    return this.pagination.data$;
  }

  ngOnInit(): void {
    this.pagination.changeValues$.subscribe(() => this.paginate());
    this.pagination.next();
  }

  ngAfterViewInit(): void {
    this.pagination.listenPageChanges([this.paginator.page]);
  }

  paginate(): void {
    this._incidentService.list(this.pagination);
  }

  destroy(id: string) {
    const dialogRef = this._confirmation.dialogRemove();
    dialogRef.afterClosed().subscribe((result) => {
      if (result != 'confirmed') return;
      this._incidentService.delete(id).subscribe(() => this.paginate());
    });
  }

  download(id: any) {
    this._incidentService.download(id);
  }

  openDialog(idPatient: any): void {
    const dialogRef = this.dialog.open(ModalDetailIncidentComponent, {
      data: { id: idPatient },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  // downloadPDF(id: number): void {
  //   this._incidentService.download(id, false).subscribe(
  //     (response: Blob) => {
  //       saveAs(response, `incidente-${id}.pdf`);
  //     },
  //     (error) => {
  //       console.error('Error al descargar el PDF:', error);
  //     }
  //   );
  // }

  // previewPDF(id: number): void {
  //   this._incidentService.download(id, true).subscribe();
  // }

  getStatusClass(status: string): string {
    switch(status?.toLowerCase()) {
      case 'pendiente':
        return 'status-pending';
      case 'completado':
        return 'status-completed';
      case 'en progreso':
        return 'status-progress';
      default:
        return 'status-pending';
    }
  }
  
  // Método para obtener el texto del tooltip para los folios
  getFolioTooltip(type: string, value: string | null): string {
    if (type === 'complaint') {
      return value ? 'Folio de queja: ' + value : 'Este incidente no tiene folio de queja asignado';
    } else {
      return value ? 'Folio de incidencia: ' + value : 'Este incidente no tiene folio de incidencia asignado';
    }
  }
}
