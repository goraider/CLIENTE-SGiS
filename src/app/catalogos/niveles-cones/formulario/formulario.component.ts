import { Component, OnInit, ElementRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';

import { environment } from '../../../../environments/environment';
import { CrudService } from '../../../crud/crud.service';

@Component({
  selector: 'niveles-cones-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ["./formulario.component.css"]
})

export class FormularioComponent {
  
  tamano = document.body.clientHeight;
  dato: FormGroup;

  clues_select: any;
  nombre_select: any;
  juris_select: any;
  jurisdicciones: any;

  cargando: boolean = false;

  public clues_term: string = `${environment.API_URL}/clues-auto?term=:keyword`;
  
  constructor(private crudService: CrudService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private _sanitizer: DomSanitizer, private _el: ElementRef) { }

  ngOnInit() {
    this.dato = this.fb.group({
      nombre: ['', [Validators.required]],
      clues: this.fb.array([]),
      jurisdicciones: this.fb.array([])
    });

    //Solo si se va a cargar catalogos poner un <a id="catalogos" (click)="ctl.cargarCatalogo('modelo','ruta')">refresh</a>
    document.getElementById("catalogos").click();
  }

  //Funciones del Autocomplete

  autocompleListFormatter = (data: any) => {

    let html = `<span>(${data.clues}) - ${data.nombre} - ${data.jurisdicciones.nombre}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  valorFormato_clue(data: any) {
    let html = `(${data.clues}) - ${data.nombre} - ${data.jurisdicciones.nombre}`;
    return html;
  }
  select_clue_autocomplete(modelo, data) {
    const um =<FormArray> this.dato.controls.clues;
    um.push(this.fb.group(data));
    (<HTMLInputElement>document.getElementById('clues_busqueda')).value = "";
  }
  select_clue_autocomplete_jurisdicciones(modelo, index, catalogo, modelo_clues) {

    if (index != "") {
      var i = 0, c = 0;
      catalogo.forEach(element => {
        if (element.id == index)
          c = i;
        i++;
      });
      
      const j = <FormArray> this.dato.controls.jurisdicciones;
      j.push(this.fb.group(catalogo[c]));

      catalogo.splice(c, 1);
      (<HTMLInputElement>document.getElementById('jurisdiccion_busqueda')).value = "";
      var url: string = `jurisdiccion-clues?term=` + index;
      this.cargando = true;
      this.crudService.lista(0, 0, url).subscribe(
        resultado => {
          const um =<FormArray> this.dato.controls.clues;
          
          for (var key of resultado.data) {
               um.push(this.fb.group(key));
          }
          // resultado.forEach(element => {
          //   //modelo_clues.push(this.fb.group(element));
          //   const um =<FormArray> this.dato.controls.clues;
          //   um.push(this.fb.group(element));
          // });
          this.cargando = false;
        },
        error => {
          this.cargando = false;
        }
      );
    }
  }
  quitar_form_array(modelo, i) {
    modelo.removeAt(i);

  }
  
  quitar_clues_jurisdiccion(modelo, data, catalogo) {
    var i = 0;
    catalogo.push(data.value);    
    const modelo_temporal = [];
    this.dato.controls.clues = this.fb.array([]);
    const um =<FormArray> this.dato.controls.clues;    
    modelo.forEach(element => {
      if (element.controls.jurisdicciones.value.nombre == data.value.nombre || element.controls.jurisdicciones.value.id == data.value.id) {        
      }
      else{
        um.controls.push(element);
      }
      i++;
    });
    
    
  }
}