import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { ConfirmationService } from 'src/app/shared/services/confirmation/confirmation.service';
import { IncidentService } from '../../services/incident.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ModalDetailIncidentComponent } from '../../components/modal-detail-incident/modal-detail-incident.component';

@Component({
  selector: 'app-list-incident',
  templateUrl: './list-incident.component.html',
  styleUrls: ['./list-incident.component.scss']
})
export class ListIncidentComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) private paginator!: MatPaginator;
  
  public pagination = new MatPagination();
  public displayedColumns = ["folio", "farm", "name", "eventDate", "actions"];

  constructor(
    public dialog: MatDialog,
    private _incidentService: IncidentService,
    private _confirmation: ConfirmationService,
    private activatedRoute: ActivatedRoute
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

  destroy(id: any): void {
    this._confirmation.dialogRemove().afterClosed().subscribe(result => {
      if (result === "confirmed") {
        this._incidentService.delete(id).subscribe(() => this.paginate());
      }
    });
  }

  download(id: any): void {
    this._incidentService.download(id);
  }

  openDialog(id: any): void {
    this.dialog.open(ModalDetailIncidentComponent, {
      data: { id: id }
    }).afterClosed().subscribe(result => {});
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case "pendiente":
        return "status-pending";
      case "completado":
        return "status-completed";
      case "en progreso":
        return "status-progress";
      default:
        return "status-pending";
    }
  }

  getFolioTooltip(type: string, value: string): string {
    return type === "complaint"
      ? (value ? "Folio de queja: " + value : "Este incidente no tiene folio de queja asignado")
      : (value ? "Folio de incidencia: " + value : "Este incidente no tiene folio de incidencia asignado");
  }
}
