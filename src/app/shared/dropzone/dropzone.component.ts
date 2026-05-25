import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ImageModel } from './interfaces/image-model.interface';
import { saveAs } from 'file-saver';
import { supportPreviewPipe } from './pipes/support-preview.pipe';
import { AbstractControl, ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Lightbox } from 'ng-gallery/lightbox';
import { Gallery, ImageItem } from 'ng-gallery';
import { DropzoneService } from './services/dropzone.service';
import { ConfirmationService } from '../services/confirmation/confirmation.service';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: [ './dropzone.component.scss' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropzoneComponent),
      multi: true
    }
  ],
})
export class DropzoneComponent implements OnInit, ControlValueAccessor {

  /**
   * Formatos aceptados
   */
  @Input () accept: string = '*';

  /**
   * Tipo de capture
   */
  @Input () capture: string = '';

  /**
   * Si es de adjunto isMultiple
   */
  @Input () isMultiple: boolean = false;

  /**
   * FormControlName
   */
   @Input() formControlName: string;

  /**
   * Api para eliminar los archivos 
   */
   @Input() api_delete: string = "/images/";

  /**
 * Permitir o omitir el mostrar el botón para eliminar archivo
 */
  @Input() deleteOnlyLocal: Boolean = false;
  
  /**
   * Emitir valores
   */
  @Output () change = new EventEmitter<any>();
 
  /**
   * Archivos en memoria
   */
  public files: ImageModel[] = [];
  public filesUpload: any[] = [];

  /**
   * FormControl del padre
   */
   private control: AbstractControl;

  onChange!: Function;
  onTouch!: Function;

  @Input() multiple: boolean = true;

  constructor(
    private _lightbox: Lightbox,
    public gallery: Gallery,
    private supportPreview: supportPreviewPipe,
    private controlContainer: ControlContainer,
    private _cFuseConfirmation: ConfirmationService,
    private dropzoneService: DropzoneService,
    
  ){

  }

  /**
   * Verifica si hay archivos en memoria
   */
  get isFilesUploaded(): boolean {
    return this.files.length > 0? true : false
  }
  
  /**
   * Mapea las propiedades de los archivos de imagen para el lightbox
   */
  get imagesLightbox(): any[] {
    return this.files.filter(file => {
        return this.supportPreview.transform(file.mimes)
    }).map(file => {
      return new ImageItem({
        src: file.link,
        thumb: file.link,
      })
    })
  }

  ngOnInit(){
    if(this.controlContainer && this.formControlName){
      this.control = this.controlContainer.control.get(this.formControlName);
    }
  }

  /**
   * Guarda en memoria los archivos adjuntados en el input
   * 
   * @param files (Files List)
   */
  getInputFiles(files: Array<any>) {
    for (let file of files)
      this.setFiles(file)
  }

  setFiles(file: any) {
    if (!file)
      return;

    let newReader = new FileReader()
    newReader.readAsDataURL(file)
    newReader.onloadend = () => file.link = newReader.result
    file.progress = 0;
    file.mimes = file.type;

    this.files = [file, ...this.files];

    this.uploadFile(file)
    this.emitChanges()
  }

  uploadFile(file: any) {
    const PORGRESS = setInterval(() => {
      if (file.progress === 90 || file.progress === 100){
        clearInterval(PORGRESS)
        return
      }
      file.progress += 10
    }, 500);

    let formData = new FormData;
    formData.append("file", file);

    this.dropzoneService.store(formData).subscribe((response) => {
      file.progress = 100;
      const FILE_UPLOAD = response.data;
      this.filesUpload.push(FILE_UPLOAD)
    })
  }

  /**
   * Elimina archivos de la lista
   * 
   * @param index (File index)
   */
  deleteFile(index: number) {
    const FILE_UPLOAD  = this.filesUpload[index]
    const ROUTE_DELETE = `${this.api_delete}${FILE_UPLOAD.name}`;

    if (this.deleteOnlyLocal || !FILE_UPLOAD.created_at) {
      this.destroyLocal(index)
      return
    }

    const dialogRef = this._cFuseConfirmation.dialogRemove()

    dialogRef.afterClosed().subscribe((result) => {
      if (result != 'confirmed')
        return

      this.dropzoneService.delete(ROUTE_DELETE).subscribe(() => this.destroyLocal(index))
    });
  }

  destroyLocal(index: number) {
    this.files.splice(index, 1);

    if (this.files.length == 0)
      this.filesUpload = [];

    this.emitChanges()
  }

  /* 
  * Descarga un archivo de la lista
  */
  download(index: number){
    const file = this.files[index]

    if(file.link && file.id)
      return saveAs(file.link, file.original_name)
    
    return saveAs(file, file.name)
  }

  /**
   * Visualizar en ventana emergente los archivos soportados
   * 
   * @param index Indice
   */
  viewer(index: number){
    const file = this.files[index]

    this.gallery.ref('myLightbox').load(this.imagesLightbox)

    if(file.link){
      this._lightbox.open(index, 'myLightbox')
    }
  }

  /**
   * Mostrar pesos
   * 
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
  * Se suscribe a los cambios de NgModel para emitir los cambios
  */
  emitChanges(){
    this.onTouch()
    console.log(this.filesUpload);
    
    this.onChange(this.filesUpload)
  }

  /**
   * Si los archivos están adjuntados (solo se utiliza para cuando no es isMultiple el componente)
   */
  get uploaded(): boolean {
    return this.files && this.files.length > 0;
  }

  writeValue(value: any | null): void {
    if (value == null) {
      this.files = [];
      this.filesUpload = [];
      return;
    }

    this.filesUpload = Array.isArray(value) ? value : [value];
    this.files = Array.isArray(value) ? value : [value];
  }  

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }  

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }  

  setDisabledState(isDisabled: boolean): void {}
}
