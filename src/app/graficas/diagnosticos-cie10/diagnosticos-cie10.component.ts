/**
* dependencias a utilizar
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title }     from '@angular/platform-browser';
import { forEach } from '@angular/router/src/utils/collection';
import { CrudService } from '../../crud/crud.service';

import { Input } from '@angular/core/src/metadata/directives';

import { Mensaje } from '../../mensaje';
import { NotificationsService } from 'angular2-notifications';

/**
* selector si se desea ocupar en un HTML
* y su archivo HTML
*/
@Component({
  selector: 'app-diagnosticos-cie10',
  templateUrl: './diagnosticos-cie10.component.html'
})

/**
* Esta clase muestra la lista del componente
* de acuerda a la ruta para acceder a los datos a mostrar.
*/
export class GiagnosticosCie10Component implements OnInit {

    /**
    * Contiene las propiedades del mensaje a mostrar
    * @type {object}
    */
    public options = {
      position: ["bottom", "left"],
      timeOut: 1000,
      lastOnBottom: true
    };

    /**
    * Contiene el titulo de la grafica en el mensaje.
    * @type {any}
    */
    titulo:any = "Diagnósticos CIE10 por Ingreso"

    /**
    * Contiene el mensaje a mostrar.
    * @type {string}
    */
    mensajeResponse: Mensaje = new Mensaje(true);

    /**
    * Contiene el array de datos a consultar.
    * @type {array:any}
    */
    datos: any[] = [];
    
    /**
    * Contiene el tamaño del cuerpo de la seccion donde esten los controles en la vista.
    * @type {any}
    */
    tamano = document.body.clientHeight;
    
    /**
    * Contiene el total de diagnosticos cie-10
    * mas frecuentes.
    * @type {array:any}
    */
    public top_cie10: any [] = [];

    /**
    * Contiene la bandaera para indicar si se cargo la lista
    * respecto a la consulta.
    * @type {boolean}
    */
    cargando: boolean = false;
    
    /**
    * Este método inicializa la carga de las dependencias 
    * que se necesitan para el funcionamiento del catalogo
    */
    constructor(private title: Title,
                private crudService: CrudService,
                private notificacion: NotificationsService,) { }
    /**
    * Este método inicializa la carga de la vista asociada junto los datos del formulario
    * @return void
    */
    ngOnInit() {

      this.listar('dashboard');
     
    }
    
    /**
    * Este método obtiene los datos de la ruta dashboard
    * @return void
    * @param url inicializa la ruta que se manda al servicio para
    * obtener los datos que se requieren.
    */
    listar(url) {
    
      this.cargando = true;
      this.crudService.lista_general(url).subscribe(
          resultado => {

              this.cargando = false;
              this.datos = resultado as any[];
     

              this.datos[2].topCie10.forEach(top_cie10 => {

                this.top_cie10.push(top_cie10);

              });

            this.mensajeResponse.mostrar = true;
            this.mensajeResponse.texto = "Lista Cargada";
            this.mensajeResponse.clase = "success";
            this.mensaje(2);

  
          },
          error => {

            this.cargando = false;
            this.mensajeResponse.mostrar = true;
            
            try {
                let e = error.json();
                if (error.status == 401) {
                    this.mensajeResponse.texto = "No tiene permiso para hacer esta operación.";
                    this.mensajeResponse.clase = "danger";
                    this.mensaje(2);
                }
            } catch (e) {
                if (error.status == 500) {
                    this.mensajeResponse.texto = "500 (Error interno del servidor)";
                } else {
                    this.mensajeResponse.texto = "pretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir. 7";
                }
                this.mensajeResponse.clase = "danger";
                this.mensaje(2);
              }
  
          }
      );
    }

   /**
   * Este método muestra los mensajes resultantes de los llamados de la api
   * @param cuentaAtras numero de segundo a esperar para que el mensaje desaparezca solo
   * @param posicion  array de posicion [vertical, horizontal]
   * @return void
   */
   mensaje(cuentaAtras: number = 6, posicion: any[] = ["bottom", "left"]): void {
    var objeto = {
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: this.mensajeResponse.texto.length
    };

    this.options = {
        position: posicion,
        timeOut: cuentaAtras * 1000,
        lastOnBottom: true
    };
    if (this.mensajeResponse.titulo == '')
        this.mensajeResponse.titulo = this.titulo;

    if (this.mensajeResponse.clase == 'alert')
        this.notificacion.alert(this.mensajeResponse.titulo, this.mensajeResponse.texto, objeto);

    if (this.mensajeResponse.clase == 'success')
        this.notificacion.success(this.mensajeResponse.titulo, this.mensajeResponse.texto, objeto);

    if (this.mensajeResponse.clase == 'info')
        this.notificacion.info(this.mensajeResponse.titulo, this.mensajeResponse.texto, objeto);

    if (this.mensajeResponse.clase == 'warning' || this.mensajeResponse.clase == 'warn')
        this.notificacion.warn(this.mensajeResponse.titulo, this.mensajeResponse.texto, objeto);

    if (this.mensajeResponse.clase == 'error' || this.mensajeResponse.clase == 'danger')
        this.notificacion.error(this.mensajeResponse.titulo, this.mensajeResponse.texto, objeto);

   }
  
}