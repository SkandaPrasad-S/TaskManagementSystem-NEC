import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatFormField, MatFormFieldModule, MatInputModule, MatIconModule } from '@angular/material'

const material1=[MatButtonModule,
MatFormFieldModule,
MatInputModule,
MatIconModule,

]
@NgModule({
  imports: [material1],
  exports:[material1]
})
export class MaterialModule { }
