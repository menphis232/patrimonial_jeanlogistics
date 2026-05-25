import { Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { BehaviorSubject, fromEvent, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IcOption } from '../c-select.interface';

@Component({
  selector: 'app-c-select',
  templateUrl: './c-select.component.html',
  styleUrls: ['./c-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CSelectComponent),
      multi: true
    }
  ],
})
export class CSelectComponent implements ControlValueAccessor, OnInit, OnChanges {

  @ViewChild('ngSelect') ngSelect : NgSelectComponent;

  /**
  * Value de las opciones del select
  */
  @Input () bindValue: string = "value";

  /**
  * Label de las opciones del select
  */
  @Input () bindLabel: string = "label";

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
  * Valor default cuando se monte el componente
  */
  @Input () options: IcOption[] = [];

  /**
   * FormControlName
   */
  @Input() formControlName: string;

  /**
  * Opciones del Select
  */
  public items$: BehaviorSubject <IcOption[]> = new BehaviorSubject([]);

  /**
  * Valor seleccionado [ngModel]
  */
  public selectValue: any;

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

  onChange!: Function;
  onTouch!: Function;

  constructor(
    private controlContainer: ControlContainer,
  ) { }

  get bindLabelTemplate(): string {
    return this.labelTemplate? 'labelTemplate' : this.bindLabel;
  }

  get items(): Observable<any[]> {
    return this.items$.pipe(
      map(item => { 
       return Array.isArray(item)? this.applyTemplate(item) : []
      })
    )
  }

  ngOnInit(): void {
    
    if(this.controlContainer && this.formControlName){
      this.control = this.controlContainer.control.get(this.formControlName);
    }

    this.items$.next(this.options)
  }

  /**
   * Verifica los cambios en el componente para actualizar las opciones
   * 
   * @param changes Cambios en los parametros
   */
  ngOnChanges(changes: SimpleChanges){
    this.items$.next(changes['options'].currentValue ?? [])
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
  * Se suscribe a los cambios de NgModel para emitir los cambios
  */
  emitChanges(value){
     this.onTouch()
     this.onChange(value)
  }

  /**
   * Se añade a la lista de opciones aquellos valores seleccionados por el usuario que por defecto no se encuentren
   * en los items
   * 
   * @param values Valores seleccionados por el usuario
   */
  addValuesToItems(values: any[]): void {
    let itemsOptions = this.items$.getValue()

    values.forEach(item => {
      if(!itemsOptions.find(itemAdded => itemAdded[this.bindValue] == item?.[this.bindValue])){
        itemsOptions.push(item)
      }
    })

    this.items$.next(itemsOptions)
  }

  writeValue(value: any): void {

    if(Array.isArray(value)){
      this.selectValue  = value.map(item => item[this.bindValue]);
      this.addValuesToItems(value)
    }
    else{
      this.selectValue  = value?.[this.bindValue] ?? null
      this.addValuesToItems(value? [ value ] : [])
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
