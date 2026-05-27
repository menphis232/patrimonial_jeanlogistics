import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MovementsService } from '../../services/movements.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-movement-detail-modal',
  templateUrl: './movement-detail-modal.component.html',
  styleUrls: ['./movement-detail-modal.component.scss'],
})
export class MovementDetailModalComponent implements OnInit {

  movement: any = null;
  isLoading = true;
  sections: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    public dialogRef: MatDialogRef<MovementDetailModalComponent>,
    private _movementsService: MovementsService,
  ) {}

  ngOnInit(): void {
    this.loadMovement();
  }

  loadMovement(): void {
    this.isLoading = true;
    this._movementsService.show(String(this.data.id)).subscribe({
      next: (response: any) => {
        this.movement = response;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  get totalEmployees(): number {
    if (!this.movement) return 0;
    return (this.movement.permanent_admin_employees || 0)
      + (this.movement.temporal_admin_employees || 0)
      + (this.movement.unionized_admin_employees || 0);
  }

  isImage(file: any): boolean {
    return ['jpg', 'jpeg', 'png', 'gif'].includes(file.extension?.toLowerCase());
  }

  getReportImage(file: any): string {
    return this.isImage(file)
      ? (environment as any).apiurl + '/files/download/' + file.name
      : 'assets/images/file-icons/document.png';
  }

  downloadReport(file: any): void {
    const url = (environment as any).apiurl + '/files/download/' + file.name;
    const isPdf = file.extension?.toLowerCase() === 'pdf' || file.name?.toLowerCase().endsWith('.pdf');
    const date = this.movement?.date_evaluation
      ? new Date(this.movement.date_evaluation).toISOString().slice(0, 10)
      : '';
    const filename = isPdf
      ? `Evaluacion-de-vulnerabilidad${date ? '-' + date : ''}.pdf`
      : file.original_name || file.name || 'archivo';

    fetch(url)
      .then(r => { if (!r.ok) throw new Error(); return r.blob(); })
      .then(blob => {
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(a.href);
      })
      .catch(() => {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.target = '_blank';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
  }

  openImagePreview(file: any): void {
    if (!this.isImage(file)) return;
    const url = this.getReportImage(file);
    window.open(url, '_blank');
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/file-icons/document.png';
    event.target.onerror = null;
  }

  getQuestionName(sectionId: number, questionId: number): string {
    const section = this.sections.find(s => s.id === sectionId);
    if (section) {
      const question = section.questions.find((q: any) => q.id === questionId);
      return question ? question.name : '';
    }
    return '';
  }

  close(): void {
    this.dialogRef.close();
  }
}
