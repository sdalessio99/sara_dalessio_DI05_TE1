import { Component, OnInit , Input, Renderer2, ElementRef} from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { GestionApiService } from 'src/app/services/gestion-api.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})

export class BarChartComponent  implements OnInit {

  //se reciben desde home.page.html
  @Input() nombresCategorias: string[] = [];
  @Input() backgroundColorCategorias: string[] = [];
  @Input() borderColorCategorias: string[] = [];

  //se crea el atributo chart
  public chart!: Chart;

  //se declara un objeto para mostrar los valores de categoria y totalResults
  public apiData: { categoria: string; totalResults: number }[] = [];

  //se declaran el servicio para gestionar la api y para crear dinamicamente los graficos en el costructor
  constructor(public gestionServiceApi: GestionApiService, private elementRef: ElementRef, private renderer: Renderer2) {}

  //Se usa el ngOnInit para crear por primera vez la grafica y para subscribirse al observable behavioursubject
  ngOnInit(): void {
    console.log("Ejecuta bar-chart");
    this.inicializarChart();

    this.gestionServiceApi.datos$.subscribe((datos) => {
      if (datos != undefined) {
        this.actualizarValoresChart(datos.categoria, datos.totalResults);
        this.actualizarChart();
      }
    });
  }

  //metodo para resolver el problema de la categoria duplicada como se propone en el foro de la tarea evaluativa
  private actualizarValoresChart(categoria: string, totalResults: number) {
    const existeEnApiData = this.apiData.find(item => item.categoria === categoria);

    if (existeEnApiData) {
      existeEnApiData.totalResults = totalResults;
    } else {
      this.apiData.push({ categoria, totalResults });
    }
  }

  //metodo para gestionar la actualizacion del chart
  private actualizarChart() {

    //objeto con una key que indica la categoria que se esta analizando
    const datasetsByCompany: { [key: string]: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number } } = {};

    //se recorren todas las categorias y se comprueba si se han dibujado ya o no
    this.apiData.forEach((row: { categoria: string; totalResults: number }, index: number) => {
      const { categoria, totalResults } = row;
      //si no se ha dibujado, se crea un objeto datasets para actualizar ese mismo valor en el chart
      if (!datasetsByCompany[categoria]) {
        datasetsByCompany[categoria] = {
          label: 'Valores de ' + categoria,
          data: [],
          backgroundColor: [this.backgroundColorCategorias[index]],
          borderColor: [this.borderColorCategorias[index]],
          borderWidth: 1
        };
      }

      //se asocian los valores al datasetByCompany
      datasetsByCompany[categoria].data[index] = totalResults;
      datasetsByCompany[categoria].backgroundColor[index] = this.backgroundColorCategorias[index];
      datasetsByCompany[categoria].borderColor[index] = this.borderColorCategorias[index];
    });

    //se actualizan los labels del chart
    this.chart.data.labels = this.apiData.map((row: { categoria: string; totalResults: number }) => row.categoria);
    //se actualizan los datasets del chart
    this.chart.data.datasets = Object.values(datasetsByCompany);
    //se actualiza el grafico
    this.chart.update();
  }

  //Método que crea la estructura inicial del gráfico y crea el canvas automático
  private inicializarChart() {

    // Declaramos el objeto para almacenar los datasets por categoría
    const datasetsByCompany: { [key: string]:
      {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor: string[];
        borderWidth: number;
      }
    } = {};

    //si no esta inicializado, entonces se crea sin nada
    if (!this.chart) {
      this.apiData.forEach((row: { categoria: string; totalResults: number }, index: number) => {
        const { categoria, totalResults } = row;

        if (!datasetsByCompany[categoria]) {
          datasetsByCompany[categoria] = {
            label: 'Valores de ' + categoria,
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
          };
        }
      });

      //Formateamos el objeto para que nos guarde en formato array de json [{},{}]
      const datasets = Object.values(datasetsByCompany);

      //se crea el canvas
      const canvas = this.renderer.createElement('canvas');
      this.renderer.setAttribute(canvas, 'id', 'bar-chart');
      const container = this.elementRef.nativeElement.querySelector('#contenedor-barchart');
      this.renderer.appendChild(container, canvas);

      //se usa el canvas al crear el chart
      this.chart = new Chart(canvas, {
        type: 'bar' as ChartType,
        data: {
          labels: this.apiData.map((row: { categoria: string; totalResults: number }) => row.categoria),
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 16,
                  weight: 'bold',
                },
              },
            }
          },
        }
      });
    } else {
      //si ya esta inicializado, se actualizan solo los datos
      this.chart.data.labels = this.apiData.map((row: { categoria: string; totalResults: number }) => row.categoria);
      this.chart.data.datasets = Object.values(datasetsByCompany);
      this.chart.update();
    }

    this.chart.canvas.width = 100;
    this.chart.canvas.height = 100;
  }

}
