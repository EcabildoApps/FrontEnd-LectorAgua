import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ToastController } from '@ionic/angular';
import imageCompression from 'browser-image-compression';



@Injectable({
  providedIn: 'root'
})
export class IonicstorageService {


  constructor(
    private storage: Storage,
    private http: HttpClient,
    private toastController: ToastController
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


  async eliminarLecturas() {
    try {
      await this.storage.remove('LECTURAS');
      console.log('Lecturas eliminadas correctamente');
    } catch (error) {
      console.error('Error al eliminar las lecturas:', error);
    }
  }


  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,  // Duración en milisegundos (2 segundos)
      position: 'bottom', // Puedes cambiar la posición (top, middle, bottom)
      color: 'primary', // Puedes cambiar el color (primary, success, danger, etc.)
    });
    toast.present();
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



  async guardarImagenAGUAAPP(byteImg: Blob, pathImg: string, tipoImg: string, ruta: string, idCuenta: string, detalle: string) {
    try {
      const aguaAppImgs = await this.storage.get('AGUAAPP_IMG');
      const aguaAppImgsArray = Array.isArray(aguaAppImgs) ? aguaAppImgs : [];

      const compressedImageBase64 = await this.compressImage(byteImg, pathImg);

      const entrada = {
        ID_AGUALEC_APP_IMG: aguaAppImgsArray.length + 1,
        BYTE_IMG: compressedImageBase64,
        FECHA_REGISTRO: new Date().toISOString(),
        PATH_IMG: pathImg,
        TIPO_IMG: tipoImg,
        RUTA: ruta,
        IDCUENTA: idCuenta,
        DETALLE: detalle
      };

      aguaAppImgsArray.push(entrada);
      await this.storage.set('AGUAAPP_IMG', aguaAppImgsArray);

      this.presentToast('Imagen guardada correctamente en AGUAAPP_IMG');
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      this.presentToast('Ocurrió un error al guardar la imagen.');
    }
  }

  async compressImage(blob: Blob, fileName: string): Promise<string> {
    try {
      const file = new File([blob], fileName, { type: blob.type });

      const options = {
        maxWidthOrHeight: 400,
        maxSizeMB: 1,
        useWebWorker: true,
        fileType: 'image/jpeg',
        quality: 0.8
      };

      let compressedImage = await imageCompression(file, options);
      console.log('Imagen comprimida:', compressedImage);

      // Reducir calidad si sigue siendo muy grande
      if (compressedImage.size > 1000000) {
        options.quality = 0.6;
        compressedImage = await imageCompression(file, options);
        console.log('Imagen comprimida nuevamente:', compressedImage);
      }

      return await this.blobToBase64(compressedImage);
    } catch (error) {
      console.error('Error al comprimir la imagen:', error);
      return await this.blobToBase64(blob);
    }
  }

  async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
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

  async obtenerTodasLasCausas() {
    try {
      const causas = await this.storage.get('CAUSAS');
      return causas ? causas.data : []; // Retorna el array de causas
    } catch (error) {
      console.error('Error al obtener las causas:', error);
      return [];
    }
  }

  // Filtrar causas por código o descripción
  async filtrarCausas(criterio: string) {
    try {
      const causas = await this.obtenerTodasLasCausas();

      if (!criterio.trim()) {
        return causas; // Si el criterio está vacío, retorna todas las causas
      }

      return causas.filter(causa =>
        causa.REN21CODI.toString().includes(criterio) ||
        causa.REN21DESC.toLowerCase().includes(criterio.toLowerCase())
      );
    } catch (error) {
      console.error('Error al filtrar causas:', error);
      return [];
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }



  async obtenerRegistrosPredios() {
    try {
      const listado = await this.listar();
      // Buscar registros con clave 'LECTURAS'
      const registrosLecturas = listado.find(item => item.k === 'PREDIOS');
      if (!registrosLecturas) {
        throw new Error('No se encontraron registros de predios.');
      }

      // Retornar los registros de 'LECTURAS' (se asume que 'data' es un array dentro de 'v')
      return registrosLecturas.v.data;
    } catch (error) {
      console.error('Error al obtener registros de predios:', error);
      throw new Error('No se pudieron obtener los registros de predios.');
    }
  }

  async obtenerRegistrosPrediosRural() {
    try {
      const listado = await this.listar();
      // Buscar registros con clave 'LECTURAS'
      const registrosLecturas = listado.find(item => item.k === 'PREDIOSRUR');
      if (!registrosLecturas) {
        throw new Error('No se encontraron registros de predios.');
      }

      // Retornar los registros de 'LECTURAS' (se asume que 'data' es un array dentro de 'v')
      return registrosLecturas.v.data;
    } catch (error) {
      console.error('Error al obtener registros de predios:', error);
      throw new Error('No se pudieron obtener los registros de predios.');
    }
  }



  async cargarPrediosConFiltroGeneral(ruta: string, valorFiltro: string = '') {
    try {
      const listado = await this.listar();
      console.log('Listado completo:', listado);

      const registrosLecturas = listado.filter(item => item.k === 'PREDIOS');
      console.log('Registros de predios:', registrosLecturas);

      if (registrosLecturas.length === 0) {
        throw new Error('No se encontraron registros de predios.');
      }

      const datosLecturas = registrosLecturas[0].v.data;
      console.log('Datos de lecturas:', datosLecturas);

      let registrosFiltrados = datosLecturas.filter(item => item.GEOCODIGO === ruta);
      console.log('Registros filtrados por GEOCODIGO:', registrosFiltrados);

      if (valorFiltro) {
        registrosFiltrados = registrosFiltrados.filter(item =>
          (item.GID && item.GID.toString().includes(valorFiltro)) ||
          (item.CLAVE_CATASTRAL && item.CLAVE_CATASTRAL.toString().includes(valorFiltro))
        );
        console.log('Registros después de aplicar filtro adicional:', registrosFiltrados);
      }

      return registrosFiltrados;
    } catch (error) {
      console.error('Error al cargar registros con filtros locales:', error);
      throw new Error('Ocurrió un error al cargar los registros locales.');
    }
  }


  async guardarOActualizarPredio(predio: any) {
    try {
      // Obtener la estructura completa de "PREDIOS"
      const prediosStorage = await this.storage.get('PREDIOS');
      const prediosData = prediosStorage ? prediosStorage.data : [];

      // Buscar si el predio ya existe en la lista
      const predioExistente = prediosData.find(item => item.IDPREDIOURBANO === predio.IDPREDIOURBANO);

      if (predioExistente) {
        // Actualizar el predio existente
        Object.assign(predioExistente, predio);
      } else {
        // Agregar un nuevo predio
        prediosData.push(predio);
      }

      // Guardar la estructura completa de nuevo en el almacenamiento
      await this.storage.set('PREDIOS', { nombreTabla: 'predios', data: prediosData });

      this.presentToast('Predio guardado correctamente');
    } catch (error) {
      console.error('Error al guardar o actualizar el predio:', error);
      this.presentToast('Ocurrió un error al guardar o actualizar el predio.');
    }
  }


  async guardarOActualizarPredioRur(predio: any) {
    try {
      // Obtener la estructura completa de "PREDIOS"
      const prediosStorage = await this.storage.get('PREDIOSRUR');
      const prediosData = prediosStorage ? prediosStorage.data : [];

      // Buscar si el predio ya existe en la lista
      const predioExistente = prediosData.find(item => item.IDPREDIOURBANO === predio.IDPREDIOURBANO);

      if (predioExistente) {
        // Actualizar el predio existente
        Object.assign(predioExistente, predio);
      } else {
        // Agregar un nuevo predio
        prediosData.push(predio);
      }

      // Guardar la estructura completa de nuevo en el almacenamiento
      await this.storage.set('PREDIOSRUR', { nombreTabla: 'prediosrur', data: prediosData });

      this.presentToast('Predio guardado correctamente');
    } catch (error) {
      console.error('Error al guardar o actualizar el predio:', error);
      this.presentToast('Ocurrió un error al guardar o actualizar el predio.');
    }
  }


  async obtenerCatalogos() {
    try {
      const catalogos = await this.storage.get('CATALOGOS');
      return catalogos ? catalogos : { // Si no existen catálogos, devolver un objeto vacío con array.
        forma: [],
        localiza: [],
        ocupa: [],
        terreno: [],
        topografia: [],
        viasmate: [],
        viasuso: []
      };
    } catch (error) {
      console.error('Error al obtener catálogos:', error);
      throw new Error('No se pudieron obtener los catálogos.');
    }
  }


  async obtenerCatalogosConstru() {
    try {
      const catalogos = await this.storage.get('CONSTRUCCION');
      return catalogos ? catalogos : {
        closet: [],
        columna: [],
        cubiertaAcabados: [],
        cubreVentana: [],
        entrePiso: [],
        escalera: [],
        estestadoCons: [],
        estructura: [],
        estructuraCubierta: [],
        insElectricas: [],
        insEspeciales: [],
        insSanitarias: [],
        nroBanios: [],
        paredes: [],
        puerta: [],
        revEscalera: [],
        revExterior: [],
        revInterior: [],
        revPisos: [],
        tumbados: [],
        ventanas: [],
        vigas: []
      };
    } catch (error) {
      console.error('Error al obtener construcciones:', error);
      throw new Error('No se pudieron obtener las construcciones.');
    }
  }

  async obtenerRegistrosAPP_PRE_CONSTRUC() {
    try {
      const construccionData = await this.storage.get('APP_PRE_CONSTRUC');
      console.log('Datos recuperados desde el almacenamiento:', construccionData);
      return construccionData;
    } catch (error) {
      console.error('Error al obtener los registros de construcción:', error);
      return null;
    }
  }


  // En tu servicio de almacenamiento
  async obtenerRegistrosConstruccion() {
    try {
      const construccionData = await this.storage.get('CONSTRUCCION');
      console.log('Datos recuperados desde el almacenamiento:', construccionData);
      return construccionData;
    } catch (error) {
      console.error('Error al obtener los registros de construcción:', error);
      return null;
    }
  }




  async guardarOActualizarConstruccion(predio: any) {
    try {
      // Obtener la estructura completa de "PREDIOS"
      const prediosStorage = await this.storage.get('APP_PRE_CONSTRUC');
      const prediosData = prediosStorage ? prediosStorage.data : [];

      // Buscar si el predio ya existe en la lista
      const predioExistente = prediosData.find(item => item.PUR01CODI === predio.PUR01CODI
      );

      if (predioExistente) {
        // Actualizar el predio existente
        Object.assign(predioExistente, predio);
      } else {
        // Agregar un nuevo predio
        prediosData.push(predio);
      }

      // Guardar la estructura completa de nuevo en el almacenamiento
      await this.storage.set('APP_PRE_CONSTRUC', { nombreTabla: 'app_pre_construc', data: prediosData });

      this.presentToast('Construccion guardado correctamente');
    } catch (error) {
      console.error('Error al guardar o actualizar el predio:', error);
      this.presentToast('Ocurrió un error al guardar o actualizar la construccion.');
    }
  }

  async cargarPrediosRURConFiltroGeneral(ruta: string, valorFiltro: string = '') {
    try {
      const listado = await this.listar();
      console.log('Listado completo:', listado);

      const registrosLecturas = listado.filter(item => item.k === 'PREDIOSRUR');
      console.log('Registros de predios:', registrosLecturas);

      if (registrosLecturas.length === 0) {
        throw new Error('No se encontraron registros de predios.');
      }

      const datosLecturas = registrosLecturas[0].v.data;
      console.log('Datos de lecturas:', datosLecturas);

      let registrosFiltrados = datosLecturas.filter(item => item.POLIGONO === ruta);
      console.log('Registros filtrados por POLIGONO:', registrosFiltrados);

      if (valorFiltro) {
        registrosFiltrados = registrosFiltrados.filter(item =>
          (item.GID && item.GID.toString().includes(valorFiltro)) ||
          (item.CLAVE_CATASTRAL && item.CLAVE_CATASTRAL.toString().includes(valorFiltro))
        );
        console.log('Registros después de aplicar filtro adicional:', registrosFiltrados);
      }

      return registrosFiltrados;
    } catch (error) {
      console.error('Error al cargar registros con filtros locales:', error);
      throw new Error('Ocurrió un error al cargar los registros locales.');
    }
  }


}