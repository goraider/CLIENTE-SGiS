/**
* <h1>Graficas Module</h1>
*<p>
* El modulo Graficas contiene todo el tipo de graficas amostrar
* en el dashboard
* </p>
*
* @author  Javier Alejandro Gosain Díaz
* @version 2.0
* @since   2018-04-30 
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ChartsModule } from 'ng2-charts';


import { TotalIngresosComponent } from './total-ingresos/total-ingresos.component';
import { TotalAltasComponent } from './total-altas/total-altas.component';
import { ClasificacionIngresosComponent } from './clasificacion-ingresos/clasificacion-ingresos.component';
import { ClasificacionEdadComponent } from './clasificacion-edad/clasificacion-edad.component';
import { GiagnosticosCie10Component } from './diagnosticos-cie10/diagnosticos-cie10.component'
import { PorcentajesComponent } from './porcentajes/porcentajes.component'


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ChartsModule,
  ],
  declarations: [TotalIngresosComponent, TotalAltasComponent, ClasificacionIngresosComponent, ClasificacionEdadComponent, GiagnosticosCie10Component, PorcentajesComponent],
  exports: [TotalIngresosComponent, TotalAltasComponent, ClasificacionIngresosComponent, ClasificacionEdadComponent, GiagnosticosCie10Component, PorcentajesComponent]
})
export class GraficasModule { }