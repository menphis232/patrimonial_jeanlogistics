import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IParamsCSelect, IQueryParam } from '../c-select.interface';
import { CSelectService } from '../c-select.service';

@Component({
  selector: 'app-c-async-select',
  templateUrl: './c-async-select.component.html',
  styleUrls: ['./c-async-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CAsyncSelectComponent),
      multi: true
    },
    CSelectService
  ],
})

export class CAsyncSelectComponent implements ControlValueAccessor, OnInit {

  @ViewChild('ngSelect') ngSelect : NgSelectComponent;

  /**
  * Si se puede limpiar la opcion seleccionada
  */
  @Input () clearable: boolean = true;
  
  /**
  * Value de las opciones del select
  */
  @Input () bindValue: string;
  
  /**
  * Label de las opciones del select
  */
  @Input () bindLabel: string;

  /**
  * Formato que tendrá el label de las opciones
  * 
  * @example
  * Un ejemplo del formato. [code] y [description] serían una propiedad de los items 
  * "{code} - {description}""   *  
  */
  @Input () labelTemplate: string = '';

  /**
  * Si el select estará deshabilitado
  */
  @Input () disabled: boolean = false;

  /**
  * Si será de selección multiple
  */
  @Input () multiple: boolean = false;

  /**
  * Placeholder
  */
  @Input () placeholder: string = "Seleccionar";
  
  /**
  * appearance
  */
  @Input() appearance: string = "outline";

  /**
   * FormControlName
   */
  @Input() formControlName: string;

  /**
   * Método del servicio al que se hará la peticion de los datos
   */
  @Input() methodService: string;

  /**
   * Método del servicio al que se hará la peticion de los datos
   */
  @Input() queryParams: IQueryParam[] = [];

  /**
   * Emite evento cada que hace un cambio significativo en el select
   */
  @Output() change = new EventEmitter<any>();

  /**
   * Se emite cada que se elimina un elemento 
   */
  @Output() remove = new EventEmitter<any>();


  /**
   * Se emite cada que se agrega un elemento
   */
  @Output() add = new EventEmitter<any>();

  /**
  * Opciones del Select
  */
  public items$: Observable <any[]> = of([]);

  /**
  * Valor seleccionado. Solo es el valor del option, no el objeto completo
  */
  public selectValue: any;

  /**
  * Valor seleccionado, pero con el objeto completo
  */
  public selectOption: any;

  /**
  * Loading cada que se realiza una busqueda
  */
  public loading: boolean = false;

  /**
  * Si estará deshabilitado
  */
  public isDisabled: boolean = false;

  /**
   * FormControl del padre
   */
  private control: AbstractControl;

  /**
   * Delay para las peticiones de api
   */
  private delaysearch: any;

  /**
   * Caché que almacenará las opciones y evitara que se hagan peticiones cada vez que se abra el select
   * Se reinicia al hacer una busqueda
   */
  private cache: boolean = false

  /**
   * Opciones en cache
   */
  private optionsCache: any[] = []

  part1
  part2
hasComma
  onChange!: Function;
  onTouch!: Function;

  constructor(
    // private controlContainer: ControlContainer,
    private _cSelect: CSelectService
  ) { }

  get bindLabelTemplate(): string {

        return this.labelTemplate? 'labelTemplate' : this.bindLabel;
     
  
    
  }

  ngOnInit(): void {
    
    // if(this.controlContainer && this.formControlName){
    //   this.control = this.controlContainer.control.get(this.formControlName);
    // }
    
  }

  /**
   * Rellena las opciones del formulario por defecto
   */
  fillData(){
    this.requestData({ 
      search: '', 
      params: this.queryParams 
    })
  }

  /**
   * Solicitar datos al servidor para pintar las opciones
   * 
   * @param params Parametros de la api
   */
  requestData(params: IParamsCSelect){
    if(this._cSelect[this.methodService]){ 

      this.loading = true;

      if(this.cache){
        this.items$ = this.assignPipe(of(this.optionsCache))
      }
      else{
        this.items$ = this.assignPipe(this._cSelect[this.methodService](params)).pipe(
            tap((data) => {
              // console.log('esta data',data)
              if(params.search == ""){
                  this.cache        = true
                  this.optionsCache = data
              }
            })
        )
      }

    }
  }

  /**
   * Se aplican las funciones rxjs al pipe del observable
   */
  assignPipe(of: Observable<any[]>){
    return of.pipe(
      tap(() => this.loading = false),
      map(data => this.applyTemplate(data)),
    )
  }

  /**
  * Busqueda en la api
  */
  search(e: { term: string }){
    
    this.resetCache()

    clearTimeout(this.delaysearch)

    this.delaysearch = setTimeout(() => {
      this.requestData({
        search: e.term,
        params: this.queryParams
      })
    }, 250)
  }

  /**
   * Se aplica un label template desde el padre para cambiar el formato de como se muestra el texto
   * de las opciones
   * 
   * @param data Resultados de la api
   * @returns 
   */
  applyTemplate(data): any[] {
    if(this.labelTemplate == '')
       return data;

    const res = data.map((item: any) => {
      
        let template = this.labelTemplate;

        Object.keys(item).forEach((key, index) => {
          const text: any = Object.values(item)[index];
          template = template.replace('{'+key+'}', text);
        })

        item.labelTemplate = template;
        return item;
    })
    
    return res;
  }

  /**
  * Resetear caché. Se puede utilizar este metodo desde el padre para volver a solicitar datos sin cache
  */
  resetCache(){
    this.cache = false
  }

  /**
   * Limpiar NgSelect nativo
   */
  clear(){
    this.ngSelect.handleClearClick()
  }

  /**
  * Se suscribe a los cambios de NgModel para emitir los cambios
  */
  emitChanges(value){
     this.onTouch()
     this.onChange(value)
     this.change.emit(value)
     this.selectOption = value
  }

  emitAddEvent(elementAdded: any) {
    this.add.emit(elementAdded)
  }

  emitRemoveEvent(elementDeleted: any) {
    this.remove.emit(elementDeleted)
  }

  writeValue(value: any): void {
     
     if(Array.isArray(value)){
       this.items$       = this.assignPipe(of(value))
       this.selectValue  = value.map(item => item[this.bindValue]);
       this.selectOption = value
     }
     else{
      this.items$       = this.assignPipe(of( value? [ value ] : [] ))
      this.selectValue  = value?.[this.bindValue] ?? null
      this.selectOption = value
     }
     
  }  

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }  

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }  

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  

}
