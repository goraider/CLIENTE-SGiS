/**
* <h1>Visitas Puerperales Module</h1>
*<p>
* El modulo Visitas Puerperales se encarga de listar las altas
* de las pacientes.
* </p>
*
* @author  Javier Alejandro Gosain Díaz
* @version 2.0
* @since   2018-04-30 
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterStateSnapshot } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

//modulos
import { HubModule } from '../../hub/hub.module';
import { PerfilModule } from '../../perfil/perfil.module';
import { BloquearPantallaModule } from '../../bloquear-pantalla/bloquear-pantalla.module';
import { VisitaPuerperalRoutingModule } from './visita-puerperal-routing.module';
import { PaginacionModule } from '../../parcial/paginacion/paginacion.module';


//componentes del catalogo
import { PipesModule }             from '../../pipes/pipes.module';
import { ListaComponent } from './lista/lista.component';
import { FormularioComponent } from './formulario/formulario.component';

//servicios
import { AuthService } from '../../auth.service';

import { MenuModule } from '../../menu/menu.module';
import { ParcialModule } from '../../parcial/parcial.module';


//crud
import { CrudService } from '../../crud/crud.service';
import { CrudModule }  from '../../crud/crud.module';
//fin crud



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VisitaPuerperalRoutingModule,
    HubModule,
    PerfilModule,
    BloquearPantallaModule,
    PaginacionModule,
    PipesModule,
    MenuModule,
    ParcialModule,
    CrudModule,
    NguiAutoCompleteModule,
 
  ],
  declarations: [
    ListaComponent,
    FormularioComponent   
  ],
  providers: [ AuthService, CrudService ],
})
export class VisitaPuerperalModule { }