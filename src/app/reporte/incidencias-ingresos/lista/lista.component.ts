/**
* dependencias a utilizar
*/
import { Component, OnInit, Input, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { CrudService } from '../../../crud/crud.service';
import { environment } from 'environments/environment';

import * as jsPDF from 'jspdf';
import * as autoTable from 'jspdf-autotable';
import * as moment from 'moment';

import { forEach } from '@angular/router/src/utils/collection';

/**
* selector si se desea ocupar en un HTML
* y su archivo HTML
*/
@Component({
  selector: 'reporte-incidencia',
  templateUrl: './lista.component.html'
})

/**
* Esta clase inicializa la lista del componente
* con los datos que se requieran.
*/
export class ReporteIncidenciaComponent{

  /**
  * Contiene el tamaño del cuerpo de la seccion donde esten los controles en la vista.
  * @type {any}
  */
  tamano = document.body.clientHeight;

  /**
  * Contiene array con los valores de la lista
  * respecto a la consulta.
  * @type {any}
  */
  datos: any[] = [];

  /**
  * Contiene la bandera para verificar
  * si se cargo la consulta.
  * @type {boolean}
  */
  cargando: boolean = false;
  
  /**
  * Contiene el objeto JSON repecto
  * a la información de la Unidad Medica.
  * @type {object}
  */
  public ingresosClue = JSON.parse(localStorage.getItem("clues"));

  /**
  * Contiene el uno de los rangos de fecha
  * fecha de inicio donde se ejecutara la consulta
  * del reporte.
  * @type {any}
  */
  fecha_inicio: any = "";
  
  /**
  * Contiene el uno de los rangos de fecha
  * fecha de final donde se ejecutara la consulta
  * del reporte.
  * @type {any}
  */
  fecha_fin: any = "";

  /**
  * contiene la informacion de
  * la unidad medica.
  * @type {any}
  */
  clues: any = "";


  //edo_incidencia: any = "";

  /**
  * contiene el estado del paciente
  * @type {any}
  */
  edo_paciente: any = "";

  /**
  * contiene el color del
  * codigo triage
  * @type {any}
  */
  color_triage: any = "";

  /**
  * contiene el turno laboral
  * @type {any}
  */
  turno: any = "";

  // referencia_origen: any = "";
  // referencia_destino: any = "";

  /**
  * contiene el diagnostico cie-10
  * @type {any}
  */
  cie10: any = "";

  /**
  * contiene el diagnostico cie-10
  * temporal, para mostrar el nombre
  * @type {any}
  */
  cie10_temp: any = "";
  //tipo_alta: any = "";

  /**
  * contiene el estado del
  * paciente del catalogo
  * @type {any}
  */
  estados_pacientes: any = "";
  
  /**
  * contiene el color triage del
  * catalogo
  * @type {any}
  */
  c_triage: any = "";
  
  /**
  * contiene el color turno del
  * catalogo
  * @type {any}
  */
  turn: any = "";

  /**
  * Contiene la bandera los
  * botones de filtrar o imprimir
  * @type {boolean}
  */
  busquedaActivada;

  //tipos_altas: any = "";
  
  /**
  * Contiene la url a consultar
  * @type {any}
  */
  url: any = "";
  
  /**
  * Contiene el estado de la fecha actual
  * @type {any}
  */
  fecha_actual: any = moment().format('YYYY-MM-D h:mm');
  
  /**
  * Variable que conecta con la URL de la API, para traer Unidades Medicas en un Autocomplet que tiene la Vista.
  * @type {string}
  */
  public clues_term: string = `${environment.API_URL}/clues-auto?term=:keyword`;
  
  /**
  * Variable que conecta con la URL de la API, para traer los diagnosticos cie10 en un Autocomplet que tiene la Vista.
  * @type {string}
  */
  public cie10_term: string = `${environment.API_URL}/subcategoriascie10-auto?term=:keyword`;

  /**
  * Este método inicializa la carga de las dependencias 
  * que se necesitan para el funcionamiento del catalogo
  */
  constructor(
    private crudService: CrudService,
    private fb: FormBuilder,
    private _sanitizer: DomSanitizer,
    private _el: ElementRef
  ){}

  //edo_incidencia: any [] = [];
  //colores_triage: any [] = [];


  /**
  * Este método inicializa la carga de la vista asociada junto los datos del formulario
  * @return void
  */
  ngOnInit(){

    moment.locale('es');
    this.fecha_fin = moment().format('YYYY-MM-D h:mm');
    this.fecha_inicio =  moment().subtract(1, 'months').format('YYYY-MM-D h:mm');

    this.clues = this.ingresosClue;

    document.getElementById("catalogos").click();

  }

  /**
  * Este método carga los catalogos conectados al servicio
  * donde los parametros se los pasa la lista.
  * @param item elemento donde se almacenara
  * @param url url de la api donde se consulta y se pone el nombre exacto como esta en la api.
  * @return void
  */
  cargarCatalogo(item, url) {
    this.crudService.lista(0, 0, url).subscribe(
      resultado => {
        this[item] = resultado.data;
      },
      error => {

      }
    );
  }

  /**
  * Este método obtiene los datos del servicio a la API
  * a consultar.
  * @return void
  * @param url inicializa la ruta que se manda al servicio para
  * obtener los datos que se requieren.
  */
  listar(url): void {
    
    this.cargando = true;
    this.crudService.lista_general(url).subscribe(
        resultado => {

         
            this.cargando = false;
            this.datos = resultado as any[];

            console.log(this.datos);


        },

        
        error => {

        }
        
    );
  }

  /**
  * Este método obtiene los datos del servicio a la API
  * a consultar.
  * @return void
  * @param url inicializa la ruta que se manda al servicio para
  * obtener los datos que se requieren de la consulta.
  * @param e el evento que detona el metodo.
  */
  lista_incidencias(url, e){
  

      this.listar('reportes/incidencias-ingresos?fecha_inicio='+this.fecha_inicio+'&fecha_fin='+
      this.fecha_fin+'&clues='+this.clues+'&color_triage='+this.color_triage+'&turno='+this.turno+
      '&edo_paciente='+this.edo_paciente+'&cie10='+this.cie10
      );
      //referencia
      //'&referencia_origen='+this.referencia_origen+'&referencia_destino='+this.referencia_destino+'&edo_incidencia='+
      //this.edo_incidencia+

  }

  /**
  * Este metodo limpia los campos
  * para realizar otra busqueda.
  * @return void
  */
  limpiar_campos_busqueda(){
    this.fecha_inicio = "";
    this.fecha_fin = "";
    //this.edo_incidencia = "";
    this.edo_paciente= "";
    this.color_triage = "";
    this.turno = "";
    // this.referencia_origen = "";
    // this.referencia_destino = "";
    this.cie10 = "";
    this.cie10_temp = "";
    //this.tipo_alta = "";
  }

  /**
  * Método para obtener los diagnosticos cie-10
  * @param modelo nombre del modelo donde se guarda el dato obtenido
  * @param item obtiene el elemnto a extraer.
  * @param datos obtiene los datos
  * @param esmodelo bandera que dermina si es o no modelo
  * @return void
  */
  select_cie10_autocomplete(modelo, item, datos, esmodelo: boolean = false) {  
    if (!esmodelo)
        modelo = datos[item];
        this.cie10 = datos[item];
  }

  /**
  * Método para obtener la unidad medica
  * @param modelo nombre del modelo donde se guarda el dato obtenido
  * @param item obtiene el elemnto a extraer.
  * @param datos obtiene los datos
  * @param esmodelo bandera que dermina si es o no modelo
  * @return void
  */
  select_clue_autocomplete(modelo, item, datos, esmodelo: boolean = false) {
    if (!esmodelo)
      modelo = datos[item];
      this.clues = datos[item];

      console.log(this.clues);
  }

  /**
  * Método para listar las unidades medicas en el Autocomplet
  * @param data contiene los elementos que se escriban en el input del Autocomplet
  */
  autocompleListFormatter = (data: any) => {
    
      let html = `<span>(${data.clues}) - ${data.nombre} </span>`;
      return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  /**
  * Método para obtener el valor de la Unidad Medica
  * @param data contiene el valor de la Unidad Medica
  * @return void
  */
  valorFormato_clue(data: any,) {

      let html = `${data.clues}`;
      return html;

      

  }

  /**
  * Método para listar los diagnosticos cie10 en el Autocomplet
  * @param data contiene los elementos que se escriban en el input del Autocomplet
  */
  autocompleFormatoSubcategoriasCIE10 = (data: any) => {
    
    let html = `<span> ${data.codigo} - ${data.nombre}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  /**
  * Método para obtener el valor del diagnostico cie10
  * @param data contiene el valor del diagnostico cie10
  * @return void
  */
  valorFormato_SubcategoriasCIE10(data: any) {

      let html = `${data.nombre}`;

      return html;
  }
  
  /**
  * Este metodo genera el pdf con la consulta del HTML
  * en la vista y con ayuda de la libreria jspdf
  * @return void
  */
  generate() {

    
      let jsPDF = require('jspdf');
      require('jspdf-autotable');

  

      var doc = new jsPDF('l');

      var img = {
        header: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4RDuRXhpZgAATU0AKgAAAAgABAE7AAIAAAAMAAAISodpAAQAAAABAAAIVpydAAEAAAAYAAAQzuocAAcAAAgMAAAAPgAAAAAc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGluZm9ybWF0aWNhAAAFkAMAAgAAABQAABCkkAQAAgAAABQAABC4kpEAAgAAAAMwNQAAkpIAAgAAAAMwNQAA6hwABwAACAwAAAiYAAAAABzqAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAxNjowODoyNCAxNDo1NjowMAAyMDE2OjA4OjI0IDE0OjU2OjAwAAAAaQBuAGYAbwByAG0AYQB0AGkAYwBhAAAA/+ELHmh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4NCjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iPjxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iLz48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+PHhtcDpDcmVhdGVEYXRlPjIwMTYtMDgtMjRUMTQ6NTY6MDAuMDUwPC94bXA6Q3JlYXRlRGF0ZT48L3JkZjpEZXNjcmlwdGlvbj48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+PGRjOmNyZWF0b3I+PHJkZjpTZXEgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48cmRmOmxpPmluZm9ybWF0aWNhPC9yZGY6bGk+PC9yZGY6U2VxPg0KCQkJPC9kYzpjcmVhdG9yPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0n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'
      }

      var fecha_actual =  moment().format('D/MM/YYYY h:mm');

  
      var res = doc.autoTableHtmlToJson(document.getElementById("datosReporte"));
      var clue = this.ingresosClue;
    
      var totalPagesExp = "{total_pages_count_string}";

      var pageContent = function (data) {
        // HEADER
        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.setFontStyle('normal');

        if (img.header ) {
          doc.addImage(img.header, 'JPEG', 30, 12, 240, 18);
          // doc.addImage(img.base64Img2, 'JPEG', 10, 10, 60, 20);
          // doc.addImage(img.base64Img3, 'JPEG', 97, 3, 15, 15);
          // doc.addImage(img.base64Img3, 'JPEG', 194, 3, 15, 15);
          
        }

        doc.text("Reporte de Ingresos", data.settings.margin.left + 117, 9);
        doc.setFontSize(8)
        doc.setFont('helvetica')
        doc.text("Sistema para la Gestión de Incidencias en Salud (SGiS)", data.settings.margin.left + 7, 13);
        doc.setFontSize(8)
        doc.setFont('helvetica')
        doc.text('('+clue.clues+')'+' '+clue.nombre, data.settings.margin.left + 90, 13);

        // FOOTER
        var str = "Pagina " + data.pageCount;
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
            str = str + " de " + totalPagesExp;
        }
        doc.setFontSize(10);
        doc.setFontType("italic");
        doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
    };
    


      doc.autoTable(res.columns, res.data, {

        startY: 31,

        margin: {
          top: 30,
          horizontal: 7
        },
        styles: {
          overflow: 'linebreak',
          fontSize: 10,
          tableWidth: 'auto',
          columnWidth: 'auto',
        },
        columnStyles: {
          0: {columnWidth: 10},
          1: {columnWidth: 40},
          2: {columnWidth: 25},
          3: {columnWidth: 25},
          4: {columnWidth: 25},
          5: {columnWidth: 70},
          6: {columnWidth: 80},
        },
        addPageContent: pageContent
      });

      if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
      }

    
      doc.save('Reporte de Ingresos'+' '+fecha_actual);
  
   }

}