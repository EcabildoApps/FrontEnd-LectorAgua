import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IonicstorageService {


  constructor(
    private storage: Storage,
    private http: HttpClient
  ) {
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  async agregarConKey(key: string, value: any) {
    await this.storage.set(key, value);
  }

  async agregar(valor: any) {
    let id = await this.storage.length() + 1;
    await this.storage.set(id.toString(), valor);
  }

  async rescatar(key: string) {
    return await this.storage.get(key);
  }

  async listar() {
    const listado: Array<{ k: string; v: any }> = [];
    await this.storage.forEach((v, k) => {
      listado.push({ k, v });
    });
    return listado;
  }

  async eliminar(key: string) {
    await this.storage.remove(key);
  }

  async eliminarTodo() {
    await this.storage.clear();
  }

  async buscarMedidoresPorNumeroParcial(nroMedidor: string) {
    try {
      // Obtener todos los datos almacenados
      const listado = await this.listar();

      // Filtrar los registros de 'LECTURAS'
      const registrosLecturas = listado.filter(item => item.k === 'LECTURAS');

      // Si no se encuentran registros de lecturas
      if (registrosLecturas.length === 0) {
        throw new Error('No se encontraron registros de lecturas.');
      }

      // Obtener los datos de las lecturas, asumiendo que están en item.v.data
      const datosLecturas = registrosLecturas[0].v.data;

      // Filtrar medidores por el número de medidor
      const medidoresEncontrados = datosLecturas.filter(item =>
        item.NRO_MEDIDOR?.toString().includes(nroMedidor) // Filtrar por número de medidor
      );

      // Si se encuentran medidores, devolverlos, si no, retornar un mensaje vacío
      return medidoresEncontrados.length > 0 ? medidoresEncontrados : [];
    } catch (error) {
      console.error('Error al buscar medidores por número parcial:', error);
      throw new Error('Ocurrió un error al buscar medidores.');
    }
  }



  async buscarCuentaNumeroParcial(nroCuenta: string) {
    try {
      // Obtener todos los datos almacenados
      const listado = await this.listar();

      // Filtrar los registros de 'LECTURAS'
      const registrosLecturas = listado.filter(item => item.k === 'LECTURAS');

      // Si no se encuentran registros de lecturas
      if (registrosLecturas.length === 0) {
        throw new Error('No se encontraron registros de lecturas.');
      }

      // Obtener los datos de las lecturas, asumiendo que están en item.v.data
      const datosLecturas = registrosLecturas[0].v.data;

      // Filtrar cuentas por el número de cuenta parcial
      const cuentasEncontradas = datosLecturas.filter(item =>
        item.NRO_CUENTA?.toString().includes(nroCuenta) // Filtrar por número de cuenta
      );

      // Si se encuentran cuentas, devolverlas, si no, retornar un mensaje vacío
      return cuentasEncontradas.length > 0 ? cuentasEncontradas : [];
    } catch (error) {
      console.error('Error al buscar cuentas por número parcial:', error);
      throw new Error('Ocurrió un error al buscar cuentas.');
    }
  }

  async cargarRegistrosConFiltrosLocal(ruta: string, filtros: string = '', valorFiltro: string = '') {
    try {
      const listado = await this.listar(); // Obtener todos los datos almacenados
      let registrosFiltrados = listado.filter(item =>
        item.k === 'CAUSAS' || item.k === 'NOVEDADES' || item.k === 'LECTURAS'
      ); // Filtrar por las claves

      if (filtros && valorFiltro) {
        switch (filtros) {
          case 'cuenta':
            registrosFiltrados = registrosFiltrados.filter(item =>
              item.v.NRO_CUENTA?.includes(valorFiltro)
            );
            break;
          case 'medidor':
            registrosFiltrados = registrosFiltrados.filter(item =>
              item.v.NRO_MEDIDOR?.includes(valorFiltro)
            );
            break;
          case 'nombres':
            registrosFiltrados = registrosFiltrados.filter(item =>
              item.v.CONSUMIDOR?.toLowerCase().includes(valorFiltro.toLowerCase())
            );
            break;
          default:
            break;
        }
      }

      return registrosFiltrados.map(item => item.v);
    } catch (error) {
      console.error('Error al cargar registros con filtros locales:', error);
      throw new Error('Ocurrió un error al cargar los registros locales.');
    }
  }


  async cargarRegistrosConFiltroGeneral(ruta: string, valorFiltro: string = '') {
    try {
      // Obtener todos los datos almacenados, incluyendo la clave 'LECTURAS'
      const listado = await this.listar(); // Aquí `listar()` obtiene todos los datos

      // Filtrar los registros que tengan la clave 'LECTURAS'
      const registrosLecturas = listado.filter(item => item.k === 'LECTURAS');

      if (registrosLecturas.length === 0) {
        throw new Error('No se encontraron registros de lecturas.');
      }

      // Acceder al array de datos de lecturas (dentro de item.v)
      const datosLecturas = registrosLecturas[0].v.data; // Suponiendo que 'v' tiene la propiedad 'data'

      // Filtrar los registros por la ruta (si es necesario)
      let registrosFiltrados = datosLecturas.filter(item => item.RUTA === ruta);

      // Aplicar el filtro adicional si se proporciona el valorFiltro
      if (valorFiltro) {
        registrosFiltrados = registrosFiltrados.filter(item =>
          item.NRO_CUENTA?.includes(valorFiltro) ||
          item.NRO_MEDIDOR?.includes(valorFiltro) ||
          item.CONSUMIDOR?.toLowerCase().includes(valorFiltro.toLowerCase())
        );
      }

      // Retornar los registros filtrados
      return registrosFiltrados;
    } catch (error) {
      console.error('Error al cargar registros con filtros locales:', error);
      throw new Error('Ocurrió un error al cargar los registros locales.');
    }
  }



  async obtenerCuentaPorID(idCuenta: number) {
    try {
      const listado = await this.listar();
      const registro = listado.find(item => item.v.IDCUENTA === idCuenta);
      return registro ? registro.v : null;
    } catch (error) {
      console.error('Error al buscar la cuenta por IDCUENTA:', error);
      throw new Error('No se pudo obtener la cuenta.');
    }
  }


  async obtenerRegistrosPorClave(clave: string) {
    try {
      const datos = await this.storage.get(clave);  // Usando Ionic Storage
      return datos ? datos : { data: [] }; // Retorna un objeto con un array vacío si no hay datos
      console.log('Datos obtenidos:', datos);
    } catch (error) {
      console.error('Error al obtener registros por clave:', error);
      throw new Error('No se pudieron obtener los registros.');
    }
  }

  async obtenerRegistrosLecturas() {
    try {
      const listado = await this.listar();
      // Buscar registros con clave 'LECTURAS'
      const registrosLecturas = listado.find(item => item.k === 'LECTURAS');
      if (!registrosLecturas) {
        throw new Error('No se encontraron registros de lecturas.');
      }

      // Retornar los registros de 'LECTURAS' (se asume que 'data' es un array dentro de 'v')
      return registrosLecturas.v.data;
    } catch (error) {
      console.error('Error al obtener registros de lecturas:', error);
      throw new Error('No se pudieron obtener los registros de lecturas.');
    }
  }




  async actualizar(key: string, nuevosValores: any) {
    try {
      const registroExistente = await this.rescatar(key);
      if (registroExistente) {
        const registroActualizado = { ...registroExistente, ...nuevosValores };
        await this.storage.set(key, registroActualizado);
        console.log(`Registro con clave ${key} actualizado con éxito.`);
        return registroActualizado;
      } else {
        console.error(`Registro con clave ${key} no encontrado.`);
        return null;
      }
    } catch (error) {
      console.error('Error al actualizar el registro:', error);
      throw new Error('No se pudo actualizar el registro.');
    }
  }






  async sincronizarConApi(ruta: string) {
    const url = `http://localhost:3000/api/auth/lecturas?ruta=${ruta}`;
    const lecturas = await this.listar();
    try {
      const response = await this.http.post(url, lecturas).toPromise();
      console.log('Lecturas sincronizadas con éxito:', response);
      await this.eliminarTodo();
      console.log('Lecturas locales eliminadas después de sincronización.');
    } catch (error) {
      console.error('Error al sincronizar las lecturas:', error);
    }
  }
}