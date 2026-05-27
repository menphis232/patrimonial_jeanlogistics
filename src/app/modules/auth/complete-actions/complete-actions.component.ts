import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-complete-actions',
  templateUrl: './complete-actions.component.html',
  styleUrls: ['./complete-actions.component.scss'],
  standalone: false
})
export class CompleteActionsComponent implements OnInit {
  @ViewChild('signInNgForm') signInNgForm!: NgForm;

  form!: FormGroup;
  routeImg = environment.apiUrl + '/files/download/';
  action: any = null;
  loading = true;
  submitting = false;
  confirmed = false;
  evidencesError = false;
  idAction: any;
  farmId: any;
  farmTypeId: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.form = this._fb.group({
      comments: ['', [Validators.required]],
      evidences: [[]]   // sin Validators.required – se valida manualmente en submit
    });

    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.idAction = params['id'];
        this.activatedRoute.queryParams.subscribe(qp => {
          this.farmId = qp['farm_id'] ?? null;
          this.farmTypeId = qp['farm_type_id'] ?? null;
          this.loadAction();
          // Marcar email como abierto
          this._authService.signIn(this.idAction, {}, this.farmId, this.farmTypeId).subscribe();
        });
      }
    });
  }

  loadAction() {
    this.loading = true;
    this._authService.show(this.idAction, this.farmId, this.farmTypeId).subscribe({
      next: (res: any) => {
        this.action = res?.data ?? res;
        this.loading = false;
        if (this.action?.status?.name && this.action.status.name !== 'Pendiente') {
          this.confirmed = true;
        }
      },
      error: () => { this.loading = false; }
    });
  }

  get statusLabel(): string {
    return this.action?.status?.name ?? 'Pendiente';
  }

  get evidences(): any[] {
    return this.action?.evidences ?? [];
  }

  getFileUrl(ev: any): string {
    return ev?.link || `${this.routeImg}${encodeURIComponent(ev?.name ?? '')}`;
  }

  getFileName(ev: any): string {
    return ev?.original_name || ev?.name || 'archivo';
  }

  isImage(ev: any): boolean {
    const name = String(ev?.name ?? ev?.original_name ?? '').toLowerCase();
    return /\.(jpg|jpeg|png|gif|webp|bmp)$/.test(name);
  }

  completarAccion() {
    this.evidencesError = false;
    const evs: any[] = this.form.get('evidences')?.value ?? [];
    if (!Array.isArray(evs) || evs.length === 0) {
      this.evidencesError = true;
      return;
    }
    if (this.form.get('comments')?.invalid) {
      this.form.get('comments')?.markAsTouched();
      return;
    }
    this.submitting = true;
    const payload = {
      comments: this.form.get('comments')?.value,
      evidences: evs.filter(f => f?.id ?? f?.file_id).map((f: any) => f.id ?? f.file_id)
    };
    this._authService.completeAction(this.idAction, payload, this.farmId, this.farmTypeId).subscribe({
      next: () => {
        this.confirmed = true;
        this.submitting = false;
      },
      error: () => { this.submitting = false; }
    });
  }
}
