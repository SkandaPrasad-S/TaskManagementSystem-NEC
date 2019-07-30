import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule,MatMenuModule,MatDialogModule, MatFormField, MatFormFieldModule, MatInputModule, MatIconModule, MatSelectModule, MatError, _MatCheckboxRequiredValidatorModule } from '@angular/material'

const material1 = [MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatSelectModule,
  _MatCheckboxRequiredValidatorModule,
  MatMenuModule,
  MatDialogModule,
]
@NgModule({
  imports: [material1],
  exports: [material1]
})
export class MaterialModule { }
