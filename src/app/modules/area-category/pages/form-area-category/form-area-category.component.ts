import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AreaCategoryService } from '../../services/area-category.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-area-category',
  templateUrl: './form-area-category.component.html'
})
export class FormAreaCategoryComponent implements OnInit {
  id: number | null = null;
  farms: any[] = [];
  farmTypes: any[] = [];
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: AreaCategoryService,
    private toastr: ToastrService,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      id: [null],
      name: ["", Validators.required],
      farm_id: [null, Validators.required],
      farm_type_id: [null],
      manager_name: [""],
      manager_email: ["", Validators.email],
      specialist_name: [""],
      specialist_email: ["", Validators.email]
    });
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get("id")) || null;
    this.loadCatalogs();

    const costCenter = localStorage.getItem("costCenter");
    const costCenterType = localStorage.getItem("costCenterType");

    if (costCenter) {
      const r = JSON.parse(costCenter);
      if (r && r.id) {
        this.form.patchValue({ farm_id: r.id });
      }
      if (r && r.farm_type_id) {
        this.form.patchValue({ farm_type_id: r.farm_type_id });
      }
    } else if (costCenterType) {
      const r = JSON.parse(costCenterType);
      if (r && r.id) {
        this.form.patchValue({ farm_type_id: r.id });
      }
    }

    if (this.id) {
      this.service.show(this.id).subscribe((r: any) => {
        this.form.patchValue(r);
      });
    }
  }

  loadCatalogs(): void {
    this.http.get<any[]>(`${environment.loginUrl}farms/getAll`).subscribe(e => this.farms = e);
    this.http.get<any[]>(`${environment.loginUrl}farms/types`).subscribe(e => this.farmTypes = e);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.service.save(this.form.value).subscribe({
      next: () => {
        this.toastr.success("Categoría de área guardada correctamente");
        this.router.navigate(["/area-categories"]);
      }
    });
  }
}
