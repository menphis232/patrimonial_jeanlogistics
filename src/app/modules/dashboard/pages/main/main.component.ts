import { Component, AfterViewInit, ViewChild,ViewEncapsulation, OnInit } from '@angular/core';
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
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format, lastDayOfMonth } from 'date-fns';

import { MaterialModule } from 'src/app/material.module';
import { BehaviorSubject } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
// export type ChartOptions = {
//   series: ApexNonAxisChartSeries;
//   chart: ApexChart;
//   responsive: ApexResponsive[];
//   labels: any;
//   theme: ApexTheme;
//   title: ApexTitleSubtitle;

// };

// export type ChartOptions = {
//   series: ApexAxisChartSeries;
//   chart: ApexChart;
//   xaxis: ApexXAxis;
//   yaxis: ApexYAxis;
//   stroke: any;
//   labels: any;
//   theme: ApexTheme;
//   tooltip: ApexTooltip;
//   dataLabels: ApexDataLabels;
//   legend: ApexLegend;
//   colors: string[];
//   markers: any;
//   grid: ApexGrid;
//   plotOptions: ApexPlotOptions;
//   fill: ApexFill;
 
// };

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
};
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule,FormsModule,ReactiveFormsModule,NgFor,NgIf],
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent implements OnInit  {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public columnChartOptions: Partial<ChartOptions> | any;
  public doughnutChartOptions: Partial<ChartOptions> | any;
  public chartOptionsperArea: Partial<ChartOptions>| any;
  public chartOptionsperCenterCost: Partial<ChartOptions>| any;
  public chartOptionsperConsultMedicalperArea: Partial<ChartOptions>| any;
  public chartOptionsperReasonConsult: Partial<ChartOptions>| any;
  public chartOptionsperIncidentPerArea: Partial<ChartOptions>| any;
  public chartOptionsperTypeIncapacities: Partial<ChartOptions>| any;
  public chartOptionsperIncapacitiesperYear: Partial<ChartOptions>| any;
  public chartOptionsperYears: Partial<ChartOptions>;
  public formFilter: FormGroup
  graphData$: BehaviorSubject<any> = new BehaviorSubject(null);
   labels = [];
   values = [];
  public chartOptionsVulnerabilityEvaluation: any;
  public chartOptionsVulnerabilityPoints: any;

  constructor(private fb: FormBuilder,private _reportService:DashboardService) {
    this.formFilter = this.fb.group({
      since: [null, Validators.required],
      until: [null, Validators.required]
    });
  }


  get firstDay() {
    const today = new Date();
    const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    
    return lastYear
  }
  ngOnInit(): void {
    this.formFilter = this.fb.group({
      since: [null, Validators.required],
      until: [null, Validators.required]
    });
   
    this.graficaAccidenteporArea(this.mapData)
   
    //  this.graficaContulamedicaPorArea(this.mapData)
     this.graficaReasonCunsultmedic(this.mapData)
     this.graficaIncidentPerArea(this.mapData)
     this.loadVulnerabilityEvaluationChart(this.formFilter.value);

    // Configurar fechas predeterminadas
    this.setDefaultDates();
    
    // Resto del código de inicialización...
    this.refresh(); // Llamar a refresh para cargar los datos con las fechas predeterminadas
  }

  /**
   * Establece las fechas predeterminadas en el formulario:
   * - Fecha desde: hace un año desde hoy
   * - Fecha hasta: fecha actual
   */
  setDefaultDates(): void {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    this.formFilter.patchValue({
      since: oneYearAgo,
      until: today
    });
  }

  /**
   * Método que se ejecuta al hacer clic en el botón "Aplicar"
   * Carga todos los gráficos con los filtros de fecha seleccionados
   */
  refresh(): void {
    if (this.formFilter.invalid) return;

    // Crear un objeto para almacenar los parámetros válidos
    const params: any = {};
    
    // Solo añadir los parámetros si tienen valores válidos
    const sinceDate = this.formFilter.get('since')?.value;
    const untilDate = this.formFilter.get('until')?.value;
    
    if (sinceDate) {
      params.since = format(new Date(sinceDate), 'yyyy-MM-dd');
    }
    
    if (untilDate) {
      params.until = format(new Date(untilDate), 'yyyy-MM-dd');
    }

    console.log('Parámetros de filtro:', params);

    // Cargar todos los gráficos con los mismos parámetros
    this.graficaAccidenteporArea(this.mapData)
    this.graficaReasonCunsultmedic(this.mapData)
    this.graficaIncidentPerArea(this.mapData)
    this.loadVulnerabilityEvaluationChart(params);
    
    // Cargar el nuevo gráfico de puntos de vulnerabilidad
    this.loadVulnerabilityPointsChart(params);
  }

  get mapData() {
    const formValue = { ...this.formFilter.value };
   
    return {
      since: format(new Date(formValue.since), 'yyyy-MM-dd') ,
      until: format(new Date(formValue.until), 'yyyy-MM-dd') ,
    }
  }

  graficaAccidenteporArea(param?){
    this._reportService.accidentPerAreaGraph(param).subscribe((v) => {
      if (v) {
    
        v.datasets.forEach((key) => {
          key.forEach((element) => {
            this.labels.push(element.label);
            this.values.push(element.data[0]);
          });
   
    
        });


        this.chartOptionsperArea = {
          series: [
            {
              name: 'Incidentes',
              data: this.values,
            },
           
          ],
          chart: {
            fontFamily: 'DM Sans,sans-serif',
            foreColor: '#a1aab2',
            height: 300,
            type: 'bar',
            stacked: true,
            toolbar: {
              show: false,
            },
          },
          plotOptions: {
            bar: {
              columnWidth: '40%',
              barHeight: '40%',
            },
          },
          dataLabels: {
            enabled: false,
          },
          markers: {
            size: 3,
          },
          stroke: {
            curve: 'straight',
            width: '0',
          },
          colors: ['#398bf7', '#06d79c'],
          legend: {
            show: true,
          },
          grid: {
            show: true,
            strokeDashArray: 0,
            borderColor: 'rgba(0,0,0,0.1)',
            xaxis: {
              lines: {
                show: true,
              },
            },
            yaxis: {
              lines: {
                show: true,
              },
            },
          },
          xaxis: {
            type: 'category',
            categories: this.labels,
          },
          tooltip: {
            theme: 'dark',
          },
        };
      



        // console.log(labels, values);
      }
    });
  }

  graficaIncapacitiesperArea(param?){
    this._reportService.typeIncapacitiesAreaGraph(param).subscribe((v) => {
      if (v) {
      
        const labelsmedicalconsult=[]
        const valuesmedicalconsult=[]
        v.forEach((key) => {
          labelsmedicalconsult.push(key.description);
          valuesmedicalconsult.push(key.quantity);
        });
       

        this.chartOptionsperTypeIncapacities = {
          series: [
            {
              name: 'Cantidad',
              data: valuesmedicalconsult,
            },
           
          ],
          chart: {
            fontFamily: 'DM Sans,sans-serif',
            foreColor: '#a1aab2',
            height: 300,
            type: 'bar',
            stacked: true,
            toolbar: {
              show: false,
            },
          },
          plotOptions: {
            bar: {
              columnWidth: '40%',
              barHeight: '40%',
            },
          },
          dataLabels: {
            enabled: false,
          },
          markers: {
            size: 3,
          },
          stroke: {
            curve: 'straight',
            width: '0',
          },
          colors: ['#398bf7', '#06d79c'],
          legend: {
            show: true,
          },
          grid: {
            show: true,
            strokeDashArray: 0,
            borderColor: 'rgba(0,0,0,0.1)',
            xaxis: {
              lines: {
                show: true,
              },
            },
            yaxis: {
              lines: {
                show: true,
              },
            },
          },
          xaxis: {
            type: 'category',
            categories: labelsmedicalconsult,
          },
          tooltip: {
            theme: 'dark',
          },
        };
      



        // console.log(labels, values);
      }
    });
  }

  graficaContulamedicaPorArea(param?){
    this._reportService.consultMedicalPerAreaGraph(param).subscribe((v) => {
      if (v) {
      
        const labelsmedicalconsult=[]
        const valuesmedicalconsult=[]
        v.datasets.forEach((key) => {
          console.log('data',key)
          labelsmedicalconsult.push(key.label);
          valuesmedicalconsult.push(key.data[0]);
        });
       

        this.chartOptionsperConsultMedicalperArea = {
          series: [
            {
              name: 'Valor de riesgo',
              data: valuesmedicalconsult,
            },
           
          ],
          chart: {
            fontFamily: 'DM Sans,sans-serif',
            foreColor: '#a1aab2',
            height: 300,
            type: 'bar',
            stacked: true,
            toolbar: {
              show: false,
            },
          },
          plotOptions: {
            bar: {
              columnWidth: '40%',
              barHeight: '40%',
            },
          },
          dataLabels: {
            enabled: false,
          },
          markers: {
            size: 3,
          },
          stroke: {
            curve: 'straight',
            width: '0',
          },
          colors: ['#398bf7', '#06d79c'],
          legend: {
            show: true,
          },
          grid: {
            show: true,
            strokeDashArray: 0,
            borderColor: 'rgba(0,0,0,0.1)',
            xaxis: {
              lines: {
                show: true,
              },
            },
            yaxis: {
              lines: {
                show: true,
              },
            },
          },
          xaxis: {
            type: 'category',
            categories: labelsmedicalconsult,
          },
          tooltip: {
            theme: 'dark',
          },
        };
      



        // console.log(labels, values);
      }
    });
  }

  graficaReasonCunsultmedic(param?){
    this._reportService.consultMedicalPerReasonGraph(param).subscribe((v) => {
      if (v) {
      
        const labelsmedicalconsult=[]
        const valuesmedicalconsult=[]
        v.datasets.forEach((key) => {
          labelsmedicalconsult.push('Daños');
          valuesmedicalconsult.push(key.data[0]);
        });
       

        this.chartOptionsperReasonConsult = {
          series: [
            {
              name: 'Dinero',
              data: valuesmedicalconsult,
            },
           
          ],
          chart: {
            fontFamily: 'DM Sans,sans-serif',
            foreColor: '#a1aab2',
            height: 300,
            type: 'bar',
            stacked: true,
            toolbar: {
              show: false,
            },
          },
          plotOptions: {
            bar: {
              columnWidth: '40%',
              barHeight: '40%',
            },
          },
          dataLabels: {
            enabled: false,
          },
          markers: {
            size: 3,
          },
          stroke: {
            curve: 'straight',
            width: '0',
          },
          colors: ['#398bf7', '#06d79c'],
          legend: {
            show: true,
          },
          grid: {
            show: true,
            strokeDashArray: 0,
            borderColor: 'rgba(0,0,0,0.1)',
            xaxis: {
              lines: {
                show: true,
              },
            },
            yaxis: {
              lines: {
                show: true,
              },
            },
          },
          xaxis: {
            type: 'category',
            categories: labelsmedicalconsult,
          },
          tooltip: {
            theme: 'dark',
          },
        };
      



        // console.log(labels, values);
      }
    });
  }

  graficaIncidentPerArea(param?){
    this._reportService.incidentPerAreaGraph(param).subscribe((v) => {
      if (v) {
      
        const labelsmedicalconsult=[]
        const valuesmedicalconsult=[]
        v.datasets.forEach((key) => {
          labelsmedicalconsult.push(key.label);
          valuesmedicalconsult.push(key.data[0]);
        });
       

        this.chartOptionsperIncidentPerArea = {
          series: [
            {
              name: 'Incidencias',
              data: valuesmedicalconsult,
            },
           
          ],
          chart: {
            fontFamily: 'DM Sans,sans-serif',
            foreColor: '#a1aab2',
            height: 300,
            type: 'bar',
            stacked: true,
            toolbar: {
              show: false,
            },
          },
          plotOptions: {
            bar: {
              columnWidth: '40%',
              barHeight: '40%',
            },
          },
          dataLabels: {
            enabled: false,
          },
          markers: {
            size: 3,
          },
          stroke: {
            curve: 'straight',
            width: '0',
          },
          colors: ['#398bf7', '#06d79c'],
          legend: {
            show: true,
          },
          grid: {
            show: true,
            strokeDashArray: 0,
            borderColor: 'rgba(0,0,0,0.1)',
            xaxis: {
              lines: {
                show: true,
              },
            },
            yaxis: {
              lines: {
                show: true,
              },
            },
          },
          xaxis: {
            type: 'category',
            categories: labelsmedicalconsult,
          },
          tooltip: {
            theme: 'dark',
          },
        };
      



        // console.log(labels, values);
      }
    });
  }


  graficaAccidenteporAnio(param?){
/**GRAFICO DE ACCIDENTE POR AÑOS */
const today = new Date();
    

this._reportService.accidentPerYearGraph({year:today.getFullYear()}).subscribe((v) => {
  if (v) {
    const labelsyear=[]
    const valuesyear=[]
    Object.keys(v).forEach((key) => {
      
      labelsyear.push(key);
      valuesyear.push(v[key]);
    });

   
    this.columnChartOptions = {
      series: [
        {
          name: 'Accidentes por año',
          data: valuesyear,
        },
       
      ],
      chart: {
        fontFamily: 'DM Sans,sans-serif',
        foreColor: '#a1aab2',
        height: 300,
        type: 'bar',
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '40%',
          barHeight: '40%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 3,
      },
      stroke: {
        curve: 'straight',
        width: '0',
      },
      colors: ['#398bf7', '#06d79c'],
      legend: {
        show: true,
      },
      grid: {
        show: true,
        strokeDashArray: 0,
        borderColor: 'rgba(0,0,0,0.1)',
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      xaxis: {
        type: 'category',
        categories: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
      },
      tooltip: {
        theme: 'dark',
      },
    };
  


   
    // console.log(labels, values);
  }
});

  }
  graficaIncidentporAnio(param?){
    /**GRAFICO DE ACCIDENTE POR AÑOS */
    const today = new Date();
  this._reportService.incapacitiesPerYearGraph({year:today.getFullYear()}).subscribe((v) => {
    if (v) {
      const labelsyear=[]
      const valuesyear=[]
      Object.keys(v).forEach((key) => {
        
        labelsyear.push(key);
        valuesyear.push(v[key]);
      });
  
     
      this.chartOptionsperIncapacitiesperYear = {
        series: [
          {
            name: 'Incidentes',
            data: valuesyear,
          },
         
        ],
        chart: {
          fontFamily: 'DM Sans,sans-serif',
          foreColor: '#a1aab2',
          height: 300,
          type: 'bar',
          stacked: true,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            columnWidth: '40%',
            barHeight: '40%',
          },
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 3,
        },
        stroke: {
          curve: 'straight',
          width: '0',
        },
        colors: ['#398bf7', '#06d79c'],
        legend: {
          show: true,
        },
        grid: {
          show: true,
          strokeDashArray: 0,
          borderColor: 'rgba(0,0,0,0.1)',
          xaxis: {
            lines: {
              show: true,
            },
          },
          yaxis: {
            lines: {
              show: true,
            },
          },
        },
        xaxis: {
          type: 'category',
          categories: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
        },
        tooltip: {
          theme: 'dark',
        },
      };
    
  
  
     
      // console.log(labels, values);
    }
  });
  
    }

  /**
   * Carga el gráfico de evaluación de vulnerabilidad
   * @param params Parámetros de filtrado (since, until)
   */
  loadVulnerabilityEvaluationChart(params: any): void {
    // Obtener el centro de trabajo del localStorage
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

    // Crear una copia de los parámetros para no modificar el original
    const requestParams = { ...params };
    
    // Añadir el farm_type_id a los parámetros si está disponible
    if (farmTypeId !== null) {
      requestParams.farm_type_id = farmTypeId;
    }

    console.log('Parámetros para gráfico de vulnerabilidad:', requestParams);

    this._reportService.getVulnerabilityEvaluations(requestParams).subscribe(
      (data: any) => {
        // Verificar que data existe
        if (!data || !Array.isArray(data) || data.length === 0) {
          this.chartOptionsVulnerabilityEvaluation = null;
          return;
        }
        
        try {
          // Preparar datos básicos y seguros para el gráfico
          const categories = [];
          const seriesData = [];
          
          // Procesar solo datos válidos
          for (const item of data) {
            if (item && item.farm && item.farm.name) {
              categories.push(item.farm.name);
              
              // Asegurar que avg_result sea un número válido
              let value = 0;
              if (item.avg_result !== null && item.avg_result !== undefined) {
                const parsed = parseFloat(item.avg_result);
                if (!isNaN(parsed)) {
                  // Redondear a 1 decimal
                  value = Math.round(parsed * 10) / 10;
                }
              }
              seriesData.push(value);
            }
          }
          
          // Si no hay datos válidos después del filtrado
          if (categories.length === 0) {
            this.chartOptionsVulnerabilityEvaluation = null;
            return;
          }
          
          // Configuración del gráfico
          this.chartOptionsVulnerabilityEvaluation = {
            series: [{
              name: 'Resultados de Vulnerabilidad',
              data: seriesData
            }],
            chart: {
              type: 'bar',
              height: 350,
              toolbar: {
                show: false
              }
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 4
              }
            },
            dataLabels: {
              enabled: false
            },
            xaxis: {
              categories: categories,
              labels: {
                style: {
                  cssClass: 'text-xs font-medium'
                }
              }
            },
            yaxis: {
              title: {
                text: 'Resultados de Vulnerabilidad'
              },
              min: 0,
              max: 5,
              labels: {
                style: {
                  cssClass: 'text-xs font-medium'
                }
              }
            },
            colors: ['#e74c3c'],
            tooltip: {
              y: {
                formatter: function(val) {
                  return val.toFixed(1);
                }
              }
            }
          };
          
          console.log('Configuración final del gráfico:', this.chartOptionsVulnerabilityEvaluation);
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

  /**
   * Carga el gráfico de puntos de vulnerabilidad
   * @param params Parámetros de filtrado (since, until)
   */
  loadVulnerabilityPointsChart(params: any): void {
    // Obtener el centro de trabajo del localStorage
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

    // Crear una copia de los parámetros para no modificar el original
    const requestParams = { ...params };
    
    // Añadir el farm_type_id a los parámetros si está disponible
    if (farmTypeId !== null) {
      requestParams.farm_type_id = farmTypeId;
    }

    console.log('Parámetros para gráfico de puntos de vulnerabilidad:', requestParams);

    this._reportService.getVulnerabilityPoints(requestParams).subscribe(
      (data: any) => {
        // Verificar que data existe
        if (!data || !Array.isArray(data) || data.length === 0) {
          this.chartOptionsVulnerabilityPoints = null;
          return;
        }
        
        try {
          // Preparar datos básicos y seguros para el gráfico
          const categories = [];
          const totalPointsData = [];
          const completionPercentageData = [];
          
          // Procesar solo datos válidos
          for (const item of data) {
            if (item && item.farm && item.farm.name) {
              categories.push(item.farm.name);
              
              // Asegurar que total_points sea un número válido
              let totalPoints = 0;
              if (item.total_points !== null && item.total_points !== undefined) {
                const parsed = parseInt(item.total_points, 10);
                if (!isNaN(parsed)) {
                  totalPoints = parsed;
                }
              }
              totalPointsData.push(totalPoints);
              
              // Asegurar que completion_percentage sea un número válido
              let completionPercentage = 0;
              if (item.completion_percentage !== null && item.completion_percentage !== undefined) {
                const parsed = parseFloat(item.completion_percentage);
                if (!isNaN(parsed)) {
                  completionPercentage = parsed;
                }
              }
              completionPercentageData.push(completionPercentage);
            }
          }
          
          // Si no hay datos válidos después del filtrado
          if (categories.length === 0) {
            this.chartOptionsVulnerabilityPoints = null;
            return;
          }
          
          // Configuración del gráfico
          this.chartOptionsVulnerabilityPoints = {
            series: [{
              name: 'Puntos de Vulnerabilidad',
              data: totalPointsData
            }],
            chart: {
              type: 'bar',
              height: 350,
              toolbar: {
                show: false
              }
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 4
              }
            },
            dataLabels: {
              enabled: false
            },
            xaxis: {
              categories: categories,
              labels: {
                style: {
                  cssClass: 'text-xs font-medium'
                }
              }
            },
            yaxis: {
              title: {
                text: 'Puntos de Vulnerabilidad'
              },
              min: 0,
              labels: {
                style: {
                  cssClass: 'text-xs font-medium'
                }
              }
            },
            colors: ['#3498db'], // Color azul para diferenciar del otro gráfico
            grid: {
              borderColor: '#e0e0e0',
              strokeDashArray: 4,
              xaxis: {
                lines: {
                  show: true
                }
              },
              yaxis: {
                lines: {
                  show: true
                }
              }
            },
            tooltip: {
              y: {
                formatter: function (val: number) {
                  return val.toString();
                }
              }
            },
            legend: {
              show: false
            }
          };
          
          console.log('Configuración final del gráfico de puntos:', this.chartOptionsVulnerabilityPoints);
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
}

