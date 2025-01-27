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
    const listado = await this.listar(); // Obtener todos los datos almacenados
    const medidoresEncontrados = listado.filter(item =>
      item.v.NRO_MEDIDOR && item.v.NRO_MEDIDOR.includes(nroMedidor)
    );
    return medidoresEncontrados.map(item => item.v); // Retorna los medidores encontrados
  }

  async buscarCuentaNumeroParcial(nroCuenta: string) {
    const listado = await this.listar(); // Obtener todos los datos almacenados

    const cuentasEncontrados = listado.filter(item =>
      item.v.NRO_MEDIDOR && item.v.NRO_CUENTA.includes(nroCuenta)
    );
    return cuentasEncontrados.map(item => item.v); // Retorna los medidores encontrados
  }
  async cargarRegistrosConFiltrosLocal(ruta: string, filtros: string = '', valorFiltro: string = '') {
    try {
      const listado = await this.listar(); // Utiliza el método listar() del servicio para obtener los datos locales
      let registrosFiltrados = listado.filter(item => item.v.RUTA === ruta);
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
      const listado = await this.listar(); // Obtener todos los datos almacenados
      let registrosFiltrados = listado.filter(item => item.v.RUTA === ruta);
      if (valorFiltro) {
        registrosFiltrados = registrosFiltrados.filter(item =>
          item.v.NRO_CUENTA?.includes(valorFiltro) ||
          item.v.NRO_MEDIDOR?.includes(valorFiltro) ||
          item.v.CONSUMIDOR?.toLowerCase().includes(valorFiltro.toLowerCase())
        );
      }

      return registrosFiltrados.map(item => item.v);
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