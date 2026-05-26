import { Component, Inject, OnInit, Optional } from '@angular/core';
import { saveAs } from 'file-saver';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  // standalone: true,
  // imports: [PdfViewerModule, MaterialModule],
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnInit {
  public src = '';
  public blob = null;
  constructor(    public dialog: MatDialog, 
    public dialogRef: MatDialogRef<PdfViewerComponent>, 
    @Optional() @Inject(MAT_DIALOG_DATA) public data) { 

      this.blob = data.blob;
      this.src = data.src;

      // console.log('este es el data',data.src)
    }

  ngOnInit(): void {
  }
  download() {
    if (this.blob) {
      const fileName = this.data?.fileName || 'evaluacion_vulnerabilidad.pdf';
      saveAs(this.blob, fileName);
    }
  }
}
