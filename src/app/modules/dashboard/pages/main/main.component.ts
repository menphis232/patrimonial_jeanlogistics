import { Component, AfterViewInit, ViewChild, ViewEncapsulation, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexYAxis,
  ApexLegend,
  ApexXAxis,
  ApexTooltip,
  ApexTheme,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  NgApexchartsModule,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexTitleSubtitle,
  ApexStroke,
} from 'ng-apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns';

import { MaterialModule } from 'src/app/material.module';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DashboardService } from '../../services/dashboard.service';
import { OfficeSelectService } from 'src/app/layouts/full/horizontal/office-select/office-select.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  colors: string[];
  grid: ApexGrid;
  markers: any;
};

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule, FormsModule, ReactiveFormsModule, NgFor, NgIf],
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent implements OnInit, OnDestroy {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  // Form Filter
  public formFilter: FormGroup;
  
  // Vulnerability Visibility Flag
  public showVulnerabilityGraphs: boolean = true;
  
  // Request Sequences for concurrency safety
  private pvByRiskLevelRequestSeq: number = 0;
  private hallazgosPorPlantaRequestSeq: number = 0;
  private incidenciasPorPlantaRequestSeq: number = 0;

  // Constants
  public readonly HALLAZGOS_PLANTA_GLOBAL: string = "__global__";
  public readonly INCIDENCIAS_PLANTA_GLOBAL: string = "__global__";

  // Color mappings
  public readonly RISK_LEVEL_COLORS: any = {
    Controlable: "#06d79c",
    Tolerable: "#f39c12",
    Inaceptable: "#e74c3c",
    "Sin nivel": "#95a5a6",
    Critico: "#c0392b",
    Alto: "#e74c3c",
    Medio: "#f39c12",
    Bajo: "#f1c40f",
    Insignificante: "#95a5a6"
  };

  public readonly INCIDENCIAS_PIE_COLORS: string[] = [
    "#0288D1", "#FF4081", "#4CAF50", "#FFC107", "#673AB7", "#FF5722", "#009688", "#E91E63",
    "#3f51b5", "#06d79c", "#e74c3c", "#9b59b6", "#1abc9c", "#34495e", "#f39c12", "#2ecc71"
  ];

  // Old Graph Data
  public graphData$: BehaviorSubject<any> = new BehaviorSubject(null);
  public labels: any[] = [];
  public values: any[] = [];

  // Chart options for all 12 charts
  public chartOptionsperArea: any;
  public chartOptionsperReasonConsult: any;
  public chartOptionsperIncidentPerArea: any;
  public chartOptionsVulnerabilityEvaluation: any;
  public chartOptionsperTypeIncapacities: any;
  public chartOptionsperIncapacitiesperYear: any;
  public columnChartOptions: any;
  public chartOptionsVulnerabilityPoints: any;
  public chartOptionsPVByRiskLevel: any;
  public chartOptionsPVByStatus: any;
  public chartOptionsPVByArea: any;
  public chartOptionsIncidencesByType: any;
  public chartOptionsIncidencesPerHour: any;

  // New Interactive Panel Data
  // Hallazgos por Planta
  public hallazgosPorPlantaRaw: any = null;
  public hallazgosPorPlantaPlantFilter: string | number = this.HALLAZGOS_PLANTA_GLOBAL;
  public hallazgosPorPlantaSummary: any = null;
  public chartOptionsHallazgosPorPlanta: any = null;

  // Incidentes por Planta
  public incidenciasPorPlantaRaw: any = null;
  public incidenciasPorPlantaPlantFilter: string | number = this.INCIDENCIAS_PLANTA_GLOBAL;
  public chartOptionsIncidenciasPiePlanta: any = null;
  public incidenciasPorPlantaPiePlantaTitle: string = "";

  // Subscription for office select changes
  private officeFilterSub: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private _reportService: DashboardService,
    private cdr: ChangeDetectorRef,
    private _officeSelect: OfficeSelectService
  ) {
    this.formFilter = this.fb.group({
      since: [null, Validators.required],
      until: [null, Validators.required]
    });
  }

  // Getters for Plant Options and list items
  get hallazgosPorPlantaPlantOptions(): string[] {
    let e = this.hallazgosPorPlantaRaw?.chart?.categories;
    return Array.isArray(e) ? e : [];
  }

  get incidenciasPorPlantaPlantOptions(): string[] {
    let e = this.incidenciasPorPlantaRaw?.plant_categories;
    return Array.isArray(e) ? e : [];
  }

  get incidenciasPorPlantaListRows(): any[] {
    let e = this.incidenciasPorPlantaRaw;
    let i = Array.isArray(e?.type_labels) ? e.type_labels : [];
    if (!i.length) return [];
    
    let a = [];
    if (this.incidenciasPorPlantaPlantFilter === this.INCIDENCIAS_PLANTA_GLOBAL || 
        this.incidenciasPorPlantaPlantFilter === null || 
        this.incidenciasPorPlantaPlantFilter === undefined) {
      a = Array.isArray(e?.totals_global_by_type) ? e.totals_global_by_type : [];
    } else {
      let r = Number(this.incidenciasPorPlantaPlantFilter);
      let s = Array.isArray(e?.by_plant) ? e.by_plant[r] : null;
      a = Array.isArray(s?.totals_by_type) ? s.totals_by_type : [];
    }
    return i.map((r, s) => ({ label: r, total: Number(a[s]) || 0 }));
  }

  get incidenciasPorPlantaListTotal(): number {
    return this.incidenciasPorPlantaListRows.reduce((e, i) => e + i.total, 0);
  }

  // Getters for conditional card visibility
  hasValidChartData(e: any, i: string = "bar"): boolean {
    if (!e || !e.series) return false;
    if (i === "pie") {
      return Array.isArray(e.series) && e.series.length > 0 && e.series.some((a: any) => a > 0);
    }
    return Array.isArray(e.series) && e.series.length > 0 && e.series.some((a: any) => a.data && Array.isArray(a.data) && a.data.some((r: any) => r > 0));
  }

  get showIncidencesByType(): boolean { return this.hasValidChartData(this.chartOptionsIncidencesByType, "pie"); }
  get showIncidencesPerHour(): boolean { return this.hasValidChartData(this.chartOptionsIncidencesPerHour, "bar"); }
  get showPerArea(): boolean { return this.hasValidChartData(this.chartOptionsperArea, "bar"); }
  get showPerReasonConsult(): boolean { return this.hasValidChartData(this.chartOptionsperReasonConsult, "bar"); }
  get showPerIncidentPerArea(): boolean { return this.hasValidChartData(this.chartOptionsperIncidentPerArea, "bar"); }
  get showVulnerabilityEvaluation(): boolean { return this.showVulnerabilityGraphs && this.hasValidChartData(this.chartOptionsVulnerabilityEvaluation, "bar"); }
  get showPerTypeIncapacities(): boolean { return this.hasValidChartData(this.chartOptionsperTypeIncapacities, "bar"); }
  get showPerIncapacitiesperYear(): boolean { return this.hasValidChartData(this.chartOptionsperIncapacitiesperYear, "bar"); }
  get showVulnerabilityPoints(): boolean { return this.showVulnerabilityGraphs && this.hasValidChartData(this.chartOptionsVulnerabilityPoints, "bar"); }
  get showPVByRiskLevel(): boolean { return this.hasValidChartData(this.chartOptionsPVByRiskLevel, "bar"); }
  get showPVByStatus(): boolean { return !!(this.chartOptionsPVByStatus && Array.isArray(this.chartOptionsPVByStatus.series) && this.chartOptionsPVByStatus.series.some((e: any) => e > 0)); }
  get showPVByArea(): boolean { return this.hasValidChartData(this.chartOptionsPVByArea, "bar"); }
  get showHallazgosPorPlanta(): boolean { return true; }
  get showIncidenciasPorPlanta(): boolean { return true; }

  // Initializer
  ngOnInit(): void {
    this.formFilter = this.fb.group({
      since: [null, Validators.required],
      until: [null, Validators.required]
    });

    this.graficaReasonCunsultmedic(this.mapData);
    this.graficaIncidentPerArea(this.mapData);
    
    this.showVulnerabilityGraphs = this.hasFarmTypeSelection();
    if (this.showVulnerabilityGraphs) {
      this.loadVulnerabilityEvaluationChart(this.formFilter.value);
    } else {
      this.chartOptionsVulnerabilityEvaluation = null;
      this.chartOptionsVulnerabilityPoints = null;
    }

    this.setDefaultDates();
    this.refresh();

    // Subscribe to filter changes in the header
    this.officeFilterSub = this._officeSelect.officeFilterChanged$
      .pipe(debounceTime(450))
      .subscribe(() => {
        if (this.formFilter.valid) {
          this.refresh();
        }
      });
  }

  ngOnDestroy(): void {
    this.officeFilterSub?.unsubscribe();
  }

  setDefaultDates(): void {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    this.formFilter.patchValue({
      since: oneYearAgo,
      until: today
    });
  }

  get mapData() {
    const formValue = { ...this.formFilter.value };
    return {
      since: format(new Date(formValue.since), 'yyyy-MM-dd'),
      until: format(new Date(formValue.until), 'yyyy-MM-dd')
    };
  }

  hasFarmTypeSelection(): boolean {
    try {
      const e = localStorage.getItem("costCenter");
      return e ? !!JSON.parse(e)?.farm_type_id : false;
    } catch {
      return false;
    }
  }

  refresh(): void {
    if (this.formFilter.invalid) return;

    const params: any = {};
    const sinceDate = this.formFilter.get('since')?.value;
    const untilDate = this.formFilter.get('until')?.value;
    
    if (sinceDate) params.since = format(new Date(sinceDate), 'yyyy-MM-dd');
    if (untilDate) params.until = format(new Date(untilDate), 'yyyy-MM-dd');

    console.log('Parámetros de filtro:', params);

    // Load standard charts
    // this.graficaAccidenteporArea(this.mapData); // place_incidences (fails, no place relation)
    // this.graficaIncapacitiesperArea(this.mapData); // incapacities_per_types (404)
    this.graficaReasonCunsultmedic(this.mapData);
    this.graficaIncidentPerArea(this.mapData);
    // this.graficaAccidenteporAnio(this.mapData); // accidents_per_year (404)
    // this.graficaIncidentporAnio(this.mapData); // incapacities_per_year (404)

    // Load vulnerability / new charts
    this.showVulnerabilityGraphs = this.hasFarmTypeSelection();
    if (this.showVulnerabilityGraphs) {
      this.loadVulnerabilityEvaluationChart(params);
      this.loadVulnerabilityPointsChart(params);
    } else {
      this.chartOptionsVulnerabilityEvaluation = null;
      this.chartOptionsVulnerabilityPoints = null;
    }

    this.loadHallazgosPorPlanta(params);
    this.loadIncidenciasPorPlanta(params);
    this.loadPVByRiskLevelChart(params);
    this.loadPVByStatusChart(params);
    this.loadPVByAreaChart(params);
    this.loadIncidencesByTypeChart(params);
    this.loadIncidencesPerHourChart(params);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Chart Loaders
  // -----------------------------------------------------------------------------------------------------

  graficaAccidenteporArea(param?) {
    this.labels = [];
    this.values = [];
    this._reportService.accidentPerAreaGraph(param).subscribe((v) => {
      if (v) {
        v.datasets?.forEach((key: any) => {
          key.forEach((element: any) => {
            this.labels.push(element.label);
            this.values.push(element.data[0]);
          });
        });

        this.chartOptionsperArea = {
          series: [{ name: 'Incidentes', data: this.values }],
          chart: {
            fontFamily: 'DM Sans,sans-serif',
            foreColor: '#a1aab2',
            height: 300,
            type: 'bar',
            stacked: true,
            toolbar: { show: false },
          },
          plotOptions: { bar: { columnWidth: '40%', barHeight: '40%' } },
          dataLabels: { enabled: false },
          markers: { size: 3 },
          stroke: { curve: 'straight', width: '0' },
          colors: ['#398bf7', '#06d79c'],
          legend: { show: true },
          grid: {
            show: true,
            strokeDashArray: 0,
            borderColor: 'rgba(0,0,0,0.1)',
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: true } },
          },
          xaxis: { type: 'category', categories: this.labels },
          tooltip: { theme: 'dark' },
        };
        this.cdr.detectChanges();
      }
    });
  }

  graficaIncapacitiesperArea(param?) {
    this._reportService.typeIncapacitiesAreaGraph(param).subscribe((v) => {
      if (v) {
        const labelsmedicalconsult: any[] = [];
        const valuesmedicalconsult: any[] = [];
        v.forEach((key: any) => {
          labelsmedicalconsult.push(key.description);
          valuesmedicalconsult.push(key.quantity);
        });

        this.chartOptionsperTypeIncapacities = {
          series: [{ name: 'Cantidad', data: valuesmedicalconsult }],
          chart: {
            fontFamily: 'DM Sans,sans-serif',
            foreColor: '#a1aab2',
            height: 300,
            type: 'bar',
            stacked: true,
            toolbar: { show: false },
          },
          plotOptions: { bar: { columnWidth: '40%', barHeight: '40%' } },
          dataLabels: { enabled: false },
          markers: { size: 3 },
          stroke: { curve: 'straight', width: '0' },
          colors: ['#398bf7', '#06d79c'],
          legend: { show: true },
          grid: {
            show: true,
            strokeDashArray: 0,
            borderColor: 'rgba(0,0,0,0.1)',
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: true } },
          },
          xaxis: { type: 'category', categories: labelsmedicalconsult },
          tooltip: { theme: 'dark' },
        };
        this.cdr.detectChanges();
      }
    });
  }

  graficaReasonCunsultmedic(param?) {
    this._reportService.consultMedicalPerReasonGraph(param).subscribe((v) => {
      if (v) {
        const labelsmedicalconsult: any[] = [];
        const valuesmedicalconsult: any[] = [];
        v.datasets?.forEach((key: any) => {
          labelsmedicalconsult.push('Daños');
          valuesmedicalconsult.push(key.data[0]);
        });

        this.chartOptionsperReasonConsult = {
          series: [{ name: 'Dinero', data: valuesmedicalconsult }],
          chart: {
            fontFamily: 'DM Sans,sans-serif',
            foreColor: '#a1aab2',
            height: 300,
            type: 'bar',
            stacked: true,
            toolbar: { show: false },
          },
          plotOptions: { bar: { columnWidth: '40%', barHeight: '40%' } },
          dataLabels: { enabled: false },
          markers: { size: 3 },
          stroke: { curve: 'straight', width: '0' },
          colors: ['#398bf7', '#06d79c'],
          legend: { show: true },
          grid: {
            show: true,
            strokeDashArray: 0,
            borderColor: 'rgba(0,0,0,0.1)',
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: true } },
          },
          xaxis: { type: 'category', categories: labelsmedicalconsult },
          tooltip: { theme: 'dark' },
        };
        this.cdr.detectChanges();
      }
    });
  }

  graficaIncidentPerArea(param?) {
    this._reportService.incidentPerAreaGraph(param).subscribe((v) => {
      if (v) {
        const labelsmedicalconsult: any[] = [];
        const valuesmedicalconsult: any[] = [];
        v.datasets?.forEach((key: any) => {
          labelsmedicalconsult.push(key.label);
          valuesmedicalconsult.push(key.data[0]);
        });

        this.chartOptionsperIncidentPerArea = {
          series: [{ name: 'Incidencias', data: valuesmedicalconsult }],
          chart: {
            fontFamily: 'DM Sans,sans-serif',
            foreColor: '#a1aab2',
            height: 300,
            type: 'bar',
            stacked: true,
            toolbar: { show: false },
          },
          plotOptions: { bar: { columnWidth: '40%', barHeight: '40%' } },
          dataLabels: { enabled: false },
          markers: { size: 3 },
          stroke: { curve: 'straight', width: '0' },
          colors: ['#398bf7', '#06d79c'],
          legend: { show: true },
          grid: {
            show: true,
            strokeDashArray: 0,
            borderColor: 'rgba(0,0,0,0.1)',
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: true } },
          },
          xaxis: { type: 'category', categories: labelsmedicalconsult },
          tooltip: { theme: 'dark' },
        };
        this.cdr.detectChanges();
      }
    });
  }

  graficaAccidenteporAnio(param?) {
    const today = new Date();
    this._reportService.accidentPerYearGraph({ year: today.getFullYear() }).subscribe((v) => {
      if (v) {
        const valuesyear: any[] = [];
        Object.keys(v).forEach((key) => {
          valuesyear.push(v[key]);
        });

        this.chartOptionsperIncapacitiesperYear = {
          series: [{ name: 'Accidentes por año', data: valuesyear }],
          chart: {
            fontFamily: 'DM Sans,sans-serif',
            foreColor: '#a1aab2',
            height: 300,
            type: 'bar',
            stacked: true,
            toolbar: { show: false },
          },
          plotOptions: { bar: { columnWidth: '40%', barHeight: '40%' } },
          dataLabels: { enabled: false },
          markers: { size: 3 },
          stroke: { curve: 'straight', width: '0' },
          colors: ['#398bf7', '#06d79c'],
          legend: { show: true },
          grid: {
            show: true,
            strokeDashArray: 0,
            borderColor: 'rgba(0,0,0,0.1)',
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: true } },
          },
          xaxis: {
            type: 'category',
            categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          },
          tooltip: { theme: 'dark' },
        };
        this.cdr.detectChanges();
      }
    });
  }

  graficaIncidentporAnio(param?) {
    const today = new Date();
    this._reportService.incapacitiesPerYearGraph({ year: today.getFullYear() }).subscribe((v) => {
      if (v) {
        const valuesyear: any[] = [];
        Object.keys(v).forEach((key) => {
          valuesyear.push(v[key]);
        });

        this.columnChartOptions = {
          series: [{ name: 'Incidentes', data: valuesyear }],
          chart: {
            fontFamily: 'DM Sans,sans-serif',
            foreColor: '#a1aab2',
            height: 300,
            type: 'bar',
            stacked: true,
            toolbar: { show: false },
          },
          plotOptions: { bar: { columnWidth: '40%', barHeight: '40%' } },
          dataLabels: { enabled: false },
          markers: { size: 3 },
          stroke: { curve: 'straight', width: '0' },
          colors: ['#398bf7', '#06d79c'],
          legend: { show: true },
          grid: {
            show: true,
            strokeDashArray: 0,
            borderColor: 'rgba(0,0,0,0.1)',
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: true } },
          },
          xaxis: {
            type: 'category',
            categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          },
          tooltip: { theme: 'dark' },
        };
        this.cdr.detectChanges();
      }
    });
  }

  loadVulnerabilityEvaluationChart(params: any): void {
    let farmTypeId = null;
    try {
      const costCenterStr = localStorage.getItem('costCenter');
      if (costCenterStr) {
        const costCenter = JSON.parse(costCenterStr);
        if (costCenter && costCenter.farm_type_id) {
          farmTypeId = costCenter.farm_type_id;
        }
      }
    } catch (error) {
      console.error('Error al obtener farm_type_id del localStorage:', error);
    }

    const requestParams = { ...params };
    if (farmTypeId !== null) {
      requestParams.farm_type_id = farmTypeId;
    }

    console.log('Parámetros para gráfico de vulnerabilidad:', requestParams);

    this._reportService.getVulnerabilityEvaluations(requestParams).subscribe(
      (data: any) => {
        if (!data || !Array.isArray(data) || data.length === 0) {
          this.chartOptionsVulnerabilityEvaluation = null;
          return;
        }
        
        try {
          const categories = [];
          const seriesData = [];
          
          for (const item of data) {
            if (item && item.farm && item.farm.name) {
              categories.push(item.farm.name);
              
              let value = 0;
              if (item.avg_result !== null && item.avg_result !== undefined) {
                const parsed = parseFloat(item.avg_result);
                if (!isNaN(parsed)) {
                  value = Math.round(parsed * 10) / 10;
                }
              }
              seriesData.push(value);
            }
          }
          
          if (categories.length === 0) {
            this.chartOptionsVulnerabilityEvaluation = null;
            return;
          }
          
          this.chartOptionsVulnerabilityEvaluation = {
            series: [{ name: 'Resultados de Vulnerabilidad', data: seriesData }],
            chart: { type: 'bar', height: 350, toolbar: { show: false } },
            plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 4 } },
            dataLabels: { enabled: false },
            xaxis: { categories: categories, labels: { style: { cssClass: 'text-xs font-medium' } } },
            yaxis: {
              title: { text: 'Resultados de Vulnerabilidad' },
              min: 0,
              max: 5,
              labels: { style: { cssClass: 'text-xs font-medium' } }
            },
            colors: ['#e74c3c'],
            tooltip: { y: { formatter: function(val: number) { return val.toFixed(1); } } }
          };
          this.cdr.detectChanges();
        } catch (error) {
          console.error('Error al procesar datos para el gráfico:', error);
          this.chartOptionsVulnerabilityEvaluation = null;
        }
      },
      error => {
        console.error('Error al cargar datos de evaluación de vulnerabilidad:', error);
        this.chartOptionsVulnerabilityEvaluation = null;
      }
    );
  }

  loadVulnerabilityPointsChart(params: any): void {
    let farmTypeId = null;
    try {
      const costCenterStr = localStorage.getItem('costCenter');
      if (costCenterStr) {
        const costCenter = JSON.parse(costCenterStr);
        if (costCenter && costCenter.farm_type_id) {
          farmTypeId = costCenter.farm_type_id;
        }
      }
    } catch (error) {
      console.error('Error al obtener farm_type_id del localStorage:', error);
    }

    const requestParams = { ...params };
    if (farmTypeId !== null) {
      requestParams.farm_type_id = farmTypeId;
    }

    console.log('Parámetros para gráfico de puntos de vulnerabilidad:', requestParams);

    this._reportService.getVulnerabilityPoints(requestParams).subscribe(
      (data: any) => {
        if (!data || !Array.isArray(data) || data.length === 0) {
          this.chartOptionsVulnerabilityPoints = null;
          return;
        }
        
        try {
          const categories = [];
          const totalPointsData = [];
          
          for (const item of data) {
            if (item && item.farm && item.farm.name) {
              categories.push(item.farm.name);
              
              let totalPoints = 0;
              if (item.total_points !== null && item.total_points !== undefined) {
                const parsed = parseInt(item.total_points, 10);
                if (!isNaN(parsed)) {
                  totalPoints = parsed;
                }
              }
              totalPointsData.push(totalPoints);
            }
          }
          
          if (categories.length === 0) {
            this.chartOptionsVulnerabilityPoints = null;
            return;
          }
          
          this.chartOptionsVulnerabilityPoints = {
            series: [{ name: 'Puntos de Vulnerabilidad', data: totalPointsData }],
            chart: { type: 'bar', height: 350, toolbar: { show: false } },
            plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 4 } },
            dataLabels: { enabled: false },
            xaxis: { categories: categories, labels: { style: { cssClass: 'text-xs font-medium' } } },
            yaxis: {
              title: { text: 'Puntos de Vulnerabilidad' },
              min: 0,
              labels: { style: { cssClass: 'text-xs font-medium' } }
            },
            colors: ['#3498db'],
            grid: {
              borderColor: '#e0e0e0',
              strokeDashArray: 4,
              xaxis: { lines: { show: true } },
              yaxis: { lines: { show: true } }
            },
            tooltip: { y: { formatter: function (val: number) { return val.toString(); } } },
            legend: { show: false }
          };
          this.cdr.detectChanges();
        } catch (error) {
          console.error('Error al procesar datos para el gráfico de puntos:', error);
          this.chartOptionsVulnerabilityPoints = null;
        }
      },
      error => {
        console.error('Error al cargar datos de puntos de vulnerabilidad:', error);
        this.chartOptionsVulnerabilityPoints = null;
      }
    );
  }

  loadPVByRiskLevelChart(e: any) {
    let i = ++this.pvByRiskLevelRequestSeq;
    this.chartOptionsPVByRiskLevel = null;
    this._reportService.getVulnerabilityPointsByRiskLevel(e).subscribe({
      next: a => {
        if (i !== this.pvByRiskLevelRequestSeq) return;
        let r = a?.by_risk_level || [];
        console.log("graph_vulnerability_points_by_risk_level response:", { res: a, list: r });
        if (!r.length || r.every((s: any) => !s.total)) {
          this.chartOptionsPVByRiskLevel = null;
          return;
        }
        this.chartOptionsPVByRiskLevel = {
          series: [{ name: "Hallazgos", data: r.map((s: any) => s.total) }],
          chart: { type: "bar", height: 350, toolbar: { show: false } },
          plotOptions: { bar: { horizontal: false, columnWidth: "55%", borderRadius: 4, distributed: true } },
          dataLabels: { enabled: true },
          xaxis: { categories: r.map((s: any) => s.name ?? s.risk_level ?? "Sin nivel"), title: { text: "Nivel de riesgo" } },
          yaxis: { 
            title: { text: "Cantidad" }, 
            min: 0, 
            forceNiceScale: true, 
            tickAmount: Math.max(...r.map((s: any) => s.total)) < 5 ? Math.max(...r.map((s: any) => s.total)) : undefined 
          },
          colors: r.map((s: any) => this.getRiskLevelColor(s)),
          tooltip: { y: { formatter: (s: any) => s.toString() } },
          legend: { show: false }
        };
        this.cdr.detectChanges();
      },
      error: () => this.chartOptionsPVByRiskLevel = null
    });
  }

  loadPVByStatusChart(e: any) {
    this.chartOptionsPVByStatus = null;
    this._reportService.getVulnerabilityPointsByStatus(e).subscribe({
      next: i => {
        let a = i?.by_status || [], r = i?.total ?? 0;
        if (!r || !a.length) {
          this.chartOptionsPVByStatus = null;
          return;
        }
        let s = a.map((n: any) => `${n.label} (${n.percentage}%)`);
        setTimeout(() => {
          this.chartOptionsPVByStatus = {
            series: a.map((n: any) => n.total),
            chart: { type: "donut", height: 350, toolbar: { show: false } },
            labels: s,
            colors: ["#01B1A3", "#DE7370"],
            dataLabels: { enabled: true, formatter: (n: any) => n.toFixed(1) + "%" },
            plotOptions: { pie: { donut: { size: "60%", labels: { show: true, total: { show: true, label: "Total", formatter: () => r.toString() } } } } },
            legend: { position: "bottom", formatter: (n: any, o: any) => o.w.globals.series[o.seriesIndex] + " - " + a[o.seriesIndex].percentage + "%" },
            tooltip: { y: { formatter: (n: any) => n + " (" + (r ? (100 * n / r).toFixed(1) : 0) + "%)" } }
          };
          this.cdr.detectChanges();
        });
      },
      error: () => this.chartOptionsPVByStatus = null
    });
  }

  loadPVByAreaChart(e: any) {
    this.chartOptionsPVByArea = null;
    this._reportService.getVulnerabilityPointsByArea(e).subscribe({
      next: i => {
        let a = i?.by_area || [];
        if (!a.length || a.every((r: any) => !r.total)) {
          this.chartOptionsPVByArea = null;
          return;
        }
        setTimeout(() => {
          this.chartOptionsPVByArea = {
            series: [{ name: "Puntos vulnerables", data: a.map((r: any) => r.total) }],
            chart: { type: "bar", height: 350, toolbar: { show: false } },
            plotOptions: { bar: { horizontal: false, columnWidth: "55%", borderRadius: 4 } },
            dataLabels: { enabled: false },
            xaxis: { categories: a.map((r: any) => r.area_name), title: { text: "Planta" } },
            yaxis: { title: { text: "Cantidad" }, min: 0 },
            colors: ["#398bf7"],
            tooltip: { y: { formatter: (r: any) => r.toString() } },
            legend: { show: false },
            grid: { borderColor: "#e0e0e0", strokeDashArray: 4 }
          };
          this.cdr.detectChanges();
        });
      },
      error: () => this.chartOptionsPVByArea = null
    });
  }

  loadHallazgosPorPlanta(e: any) {
    let i = ++this.hallazgosPorPlantaRequestSeq,
        a = new Date(),
        r = e?.since ? String(e.since) : format(new Date(a.getFullYear(), 0, 1), "yyyy-MM-dd"),
        s = e?.until ? String(e.until) : format(a, "yyyy-MM-dd");
        
    console.log("graph_hallazgos_por_planta request:", { since: r, until: s });
    
    this._reportService.getHallazgosPorPlanta({ since: r, until: s }).subscribe({
      next: n => {
        if (i !== this.hallazgosPorPlantaRequestSeq) return;
        let o = n && n.data != null ? n.data : n;
        this.hallazgosPorPlantaRaw = o;
        this.hallazgosPorPlantaPlantFilter = this.HALLAZGOS_PLANTA_GLOBAL;
        
        let h = o?.chart,
            c = h?.categories,
            d = h?.series;
            
        if (!Array.isArray(c) || !c.length || !Array.isArray(d) || !d.length) {
          this.chartOptionsHallazgosPorPlanta = null;
          this.applyHallazgosPorPlantaSummary();
          return;
        }
        
        this.applyHallazgosPorPlantaSummary();
        this.rebuildHallazgosPorPlantaChartFromFilter();
        console.log("HallazgosPorPlanta chart series:", d);
      },
      error: () => {
        if (i === this.hallazgosPorPlantaRequestSeq) {
          this.hallazgosPorPlantaRaw = null;
          this.hallazgosPorPlantaPlantFilter = this.HALLAZGOS_PLANTA_GLOBAL;
          this.hallazgosPorPlantaSummary = { total: 0, by_level: [] };
          this.chartOptionsHallazgosPorPlanta = null;
        }
      }
    });
  }

  loadIncidenciasPorPlanta(e: any) {
    let i = ++this.incidenciasPorPlantaRequestSeq,
        a = new Date(),
        r = e?.since ? String(e.since) : format(new Date(a.getFullYear(), 0, 1), "yyyy-MM-dd"),
        s = e?.until ? String(e.until) : format(a, "yyyy-MM-dd");
        
    this._reportService.getIncidenciasPorPlanta({ since: r, until: s }).subscribe({
      next: n => {
        if (i !== this.incidenciasPorPlantaRequestSeq) return;
        let o = n && n.data != null ? n.data : n;
        this.incidenciasPorPlantaRaw = o;
        this.incidenciasPorPlantaPlantFilter = this.INCIDENCIAS_PLANTA_GLOBAL;
        this.rebuildIncidenciasPorPlantaCharts();
        this.cdr.detectChanges();
      },
      error: () => {
        if (i === this.incidenciasPorPlantaRequestSeq) {
          this.incidenciasPorPlantaRaw = null;
          this.incidenciasPorPlantaPlantFilter = this.INCIDENCIAS_PLANTA_GLOBAL;
          this.chartOptionsIncidenciasPiePlanta = null;
          this.incidenciasPorPlantaPiePlantaTitle = "";
        }
      }
    });
  }

  loadIncidencesByTypeChart(e: any) {
    this._reportService.incidencesByTypeGraph(e).subscribe(i => {
      if (i && i.labels && i.datasets && i.datasets.length > 0) {
        let a = i.datasets[0];
        this.chartOptionsIncidencesByType = {
          series: a.data,
          chart: { type: "pie", height: 350, fontFamily: "DM Sans,sans-serif", foreColor: "#a1aab2", toolbar: { show: false } },
          labels: i.labels,
          colors: a.backgroundColor || ["#398bf7", "#06d79c", "#f39c12", "#e74c3c", "#9b59b6", "#1abc9c", "#34495e", "#f1c40f", "#e67e22", "#2ecc71"],
          dataLabels: { enabled: true, formatter: function (r: any) { return r.toFixed(1) + "%" }, style: { fontSize: "12px", fontWeight: "bold" } },
          plotOptions: { pie: { donut: { size: "0%" } } },
          legend: {
            show: true,
            position: "bottom",
            horizontalAlign: "center",
            floating: false,
            fontSize: "12px",
            fontWeight: 400,
            formatter: function (r: any, s: any) { return r + ": " + s.w.globals.series[s.seriesIndex] }
          },
          tooltip: { theme: "dark", y: { formatter: function (r: any) { return r + " incidencias" } } },
          responsive: [{ breakpoint: 480, options: { chart: { height: 300 }, legend: { position: "bottom" } } }]
        };
      } else {
        this.chartOptionsIncidencesByType = null;
      }
      this.cdr.detectChanges();
    }, () => {
      this.chartOptionsIncidencesByType = null;
    });
  }

  loadIncidencesPerHourChart(e: any) {
    this._reportService.incidencesPerHourGraph(e).subscribe(i => {
      if (i && i.labels && i.datasets && i.datasets.length > 0) {
        let a = i.datasets[0];
        this.chartOptionsIncidencesPerHour = {
          series: [{ name: a.label, data: a.data }],
          chart: { fontFamily: "DM Sans,sans-serif", foreColor: "#a1aab2", height: 350, type: "bar", toolbar: { show: false } },
          plotOptions: { bar: { columnWidth: "60%", barHeight: "70%", borderRadius: 4, horizontal: false } },
          dataLabels: { enabled: false },
          markers: { size: 3 },
          stroke: { curve: "straight", width: "0" },
          colors: ["#398bf7"],
          legend: { show: true },
          grid: { show: true, strokeDashArray: 0, borderColor: "rgba(0,0,0,0.1)", xaxis: { lines: { show: true } }, yaxis: { lines: { show: true } } },
          xaxis: { type: "category", categories: i.labels, title: { text: "Hora del día" }, labels: { style: { fontSize: "11px" } } },
          yaxis: { title: { text: "Número de incidencias" }, labels: { formatter: function (r: any) { return r.toFixed(0) } } },
          tooltip: { theme: "dark", y: { formatter: function (r: any) { return r + " incidencias" } } }
        };
      } else {
        this.chartOptionsIncidencesPerHour = null;
      }
      this.cdr.detectChanges();
    }, () => {
      this.chartOptionsIncidencesPerHour = null;
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Interactive Panel Logic
  // -----------------------------------------------------------------------------------------------------

  compareHallazgosPlanta = (s: any, n: any): boolean => {
    if (s === n || (s == null && n == null)) return true;
    if (typeof s != typeof n && s != null && n != null) {
      let o = Number(s), h = Number(n);
      if (Number.isFinite(o) && Number.isFinite(h) && o === h) return true;
    }
    return false;
  }

  onHallazgosPlantaFilterChange(e: any) {
    if (e === this.HALLAZGOS_PLANTA_GLOBAL || e === "null" || e === "") {
      this.hallazgosPorPlantaPlantFilter = this.HALLAZGOS_PLANTA_GLOBAL;
    } else {
      let i = Number(e);
      this.hallazgosPorPlantaPlantFilter = Number.isFinite(i) ? i : this.HALLAZGOS_PLANTA_GLOBAL;
    }
    this.applyHallazgosPorPlantaSummary();
    this.rebuildHallazgosPorPlantaChartFromFilter();
    this.cdr.detectChanges();
  }

  onIncidenciasPlantaFilterChange(e: any) {
    if (e === this.INCIDENCIAS_PLANTA_GLOBAL || e === "null" || e === "") {
      this.incidenciasPorPlantaPlantFilter = this.INCIDENCIAS_PLANTA_GLOBAL;
    } else {
      let i = Number(e);
      this.incidenciasPorPlantaPlantFilter = Number.isFinite(i) ? i : this.INCIDENCIAS_PLANTA_GLOBAL;
    }
    this.rebuildIncidenciasPorPlantaCharts();
    this.cdr.detectChanges();
  }

  applyHallazgosPorPlantaSummary() {
    let e = this.hallazgosPorPlantaRaw;
    if (!e) {
      this.hallazgosPorPlantaSummary = null;
      return;
    }
    
    if (this.hallazgosPorPlantaPlantFilter === this.HALLAZGOS_PLANTA_GLOBAL || 
        this.hallazgosPorPlantaPlantFilter === null || 
        this.hallazgosPorPlantaPlantFilter === undefined) {
      let o = e.risk_level_summary,
          h = Array.isArray(o?.by_level) ? o.by_level : [],
          c = o?.total ?? 0;
          
      this.hallazgosPorPlantaSummary = (c > 0 || h.length > 0) ? {
        total: c,
        by_level: h.map((d: any) => ({
          name: d.name,
          total: Number(d.total) || 0,
          risk_level: d.risk_level ?? d.name
        }))
      } : null;
      return;
    }
    
    let i = Number(this.hallazgosPorPlantaPlantFilter);
    if (!Number.isInteger(i) || i < 0) {
      this.hallazgosPorPlantaSummary = { total: 0, by_level: [] };
      return;
    }
    
    let a = Array.isArray(e.chart?.categories) ? e.chart.categories : [],
        r = e.chart?.series;
        
    if (!Array.isArray(r) || !r.length || i < 0 || i >= a.length) {
      this.hallazgosPorPlantaSummary = { total: 0, by_level: [] };
      return;
    }
    
    let s = 0,
        n = r.map((o: any) => {
          let h = (Array.isArray(o?.data) && Number(o.data[i])) || 0;
          s += h;
          let c = o?.name ?? "Sin nivel";
          return { name: c, risk_level: c, total: h };
        });
        
    this.hallazgosPorPlantaSummary = { total: s, by_level: n };
  }

  rebuildHallazgosPorPlantaChartFromFilter() {
    let i = this.hallazgosPorPlantaRaw?.chart,
        a = Array.isArray(i?.categories) ? i.categories : [],
        r = i?.series;
        
    if (!a.length || !Array.isArray(r) || !r.length) {
      this.chartOptionsHallazgosPorPlanta = null;
      return;
    }
    
    let s = this.hallazgosPorPlantaPlantFilter === this.HALLAZGOS_PLANTA_GLOBAL || 
            this.hallazgosPorPlantaPlantFilter === null || 
            this.hallazgosPorPlantaPlantFilter === undefined,
        n: any[],
        o: any[];
        
    if (s) {
      n = [...a];
      o = r.map((c: any) => ({
        name: String(c?.name ?? "Sin nivel"),
        data: Array.isArray(c?.data) ? c.data.map((d: any) => Number(d) || 0) : []
      }));
    } else {
      let c = Number(this.hallazgosPorPlantaPlantFilter);
      if (!Number.isInteger(c) || c < 0 || c >= a.length) {
        this.chartOptionsHallazgosPorPlanta = null;
        return;
      }
      n = [String(a[c] ?? `Planta ${c}`)];
      o = r.map((u: any) => {
        let p = (Array.isArray(u?.data) && Number(u.data[c])) || 0;
        return { name: String(u?.name ?? "Sin nivel"), data: [p] };
      });
    }
    
    let h = o.map(c => this.getRiskLevelColor({ name: c.name, risk_level: c.name }));
    
    this.chartOptionsHallazgosPorPlanta = {
      series: o,
      chart: { type: "bar", height: 350, toolbar: { show: false } },
      plotOptions: { bar: { horizontal: false, columnWidth: s ? "70%" : "40%", borderRadius: 4, stacked: true } },
      dataLabels: { enabled: true, formatter: (c: any) => c === 0 ? "" : String(c), style: { colors: ["#ffffff"], fontSize: "12px" } },
      xaxis: { categories: n, title: { text: s ? "Planta" : "Planta seleccionada" } },
      yaxis: { title: { text: "Cantidad" }, min: 0 },
      colors: h,
      legend: { position: "bottom", horizontalAlign: "center" },
      tooltip: { y: { formatter: (c: any) => c.toString() } },
      grid: { borderColor: "#e0e0e0", strokeDashArray: 4 }
    };
  }

  rebuildIncidenciasPorPlantaCharts() {
    let e = this.incidenciasPorPlantaRaw,
        i = Array.isArray(e?.type_labels) ? e.type_labels : [],
        a = Array.isArray(e?.by_plant) ? e.by_plant : [];
        
    if (this.incidenciasPorPlantaPlantFilter === this.INCIDENCIAS_PLANTA_GLOBAL || 
        this.incidenciasPorPlantaPlantFilter === null || 
        this.incidenciasPorPlantaPlantFilter === undefined) {
      let h = e?.totals_global_by_type, c = [];
      if (Array.isArray(h) && h.length === i.length) {
        c = i.map((d, u) => Number(h[u]) || 0);
      } else {
        c = i.map((d, u) => a.reduce((p, x) => p + (Number(x?.totals_by_type?.[u]) || 0), 0));
      }
      this.incidenciasPorPlantaPiePlantaTitle = "Todas las plantas";
      this.chartOptionsIncidenciasPiePlanta = (i.length && c.length) ? this.buildIncidenciasPieChart(i, c, 340) : null;
      return;
    }
    
    let s = Number(this.incidenciasPorPlantaPlantFilter),
        n = a[s] ?? null,
        o = Array.isArray(n?.totals_by_type) ? n.totals_by_type : [];
        
    this.incidenciasPorPlantaPiePlantaTitle = n?.plant_name ? String(n.plant_name) : (this.incidenciasPorPlantaPlantOptions[s] ?? "Planta");
    this.chartOptionsIncidenciasPiePlanta = (i.length && o.length) ? this.buildIncidenciasPieChart(i, o, 340) : null;
  }

  buildIncidenciasPieChart(e: any[], i: any[], a = 320) {
    let r = e.map((c, d) => ({ label: c, v: Number(i[d]) || 0 })).filter(c => c.v > 0);
    if (!r.length) return null;
    let s = r.map(c => c.v),
        n = r.map(c => c.label),
        o = r.map((c, d) => this.INCIDENCIAS_PIE_COLORS[d % this.INCIDENCIAS_PIE_COLORS.length]),
        h = s.reduce((c, d) => c + d, 0);
        
    return {
      series: s,
      labels: n,
      chart: {
        type: "pie",
        height: a,
        fontFamily: "DM Sans,sans-serif",
        foreColor: "#a1aab2",
        toolbar: { show: false }
      },
      colors: o,
      dataLabels: {
        enabled: true,
        formatter: (c: any, d: any) => {
          let u = d.w.globals.series[d.seriesIndex],
              p = h ? (100 * u / h).toFixed(0) : "0";
          return `${u} (${p}%)`;
        },
        style: { fontSize: "11px", fontWeight: 600 }
      },
      plotOptions: { pie: { donut: { size: "0%" } } },
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
        fontSize: "11px",
        formatter: (c: any, d: any) => c + ": " + d.w.globals.series[d.seriesIndex]
      },
      tooltip: { y: { formatter: (c: any) => `${c} registro(s)` } }
    };
  }

  getRiskLevelColor(e: any) {
    let i = String(e?.name ?? e?.risk_level ?? "Sin nivel").trim() || "Sin nivel";
    let a = Object.keys(this.RISK_LEVEL_COLORS).find(r => r.toLowerCase() === i.toLowerCase()) ?? i;
    return this.RISK_LEVEL_COLORS[a] ?? this.RISK_LEVEL_COLORS["Sin nivel"] ?? "#95a5a6";
  }
}
