import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-viewer-dialog',
  templateUrl: './image-viewer-dialog.component.html',
  styleUrls: ['./image-viewer-dialog.component.scss']
})
export class ImageViewerDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ImageViewerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { imageUrl: string; imageName?: string }
  ) {}

  ngOnInit(): void {}

  onBackdropClick(): void {
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
  }
}
