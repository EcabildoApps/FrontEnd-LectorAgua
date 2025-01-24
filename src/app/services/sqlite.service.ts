import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CapacitorSQLite, JsonSQLite } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  public dbready: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isWeb: boolean;
  public isIOS: boolean;
  public dbName: string;
  public jeepSqlite: any;

  public readonly dbConfig = {
    database: 'lecturas.db',
    version: 1,
    encrypted: false,
    mode: "full",
    tables: [
      {
        name: "AGUALEC_APP",
        schema: [
          { column: "IDCUENTA", value: "INTEGER PRIMARY KEY NOT NULL" },
          { column: "NRO_CUENTA", value: "TEXT NOT NULL" },
          { column: "NRO_MEDIDOR", value: "TEXT NOT NULL" },
          { column: "CIU", value: "TEXT" },
          { column: "CONSUMIDOR", value: "TEXT" },
          { column: "CEDULA_RUC", value: "TEXT" },
          { column: "EMAIL", value: "TEXT" },
          { column: "PARROQUIA", value: "TEXT" },
          { column: "SECTOR", value: "TEXT" },
          { column: "RUTA", value: "TEXT" },
          { column: "SEQUENCIA", value: "INTEGER" },
          { column: "DIRECCION", value: "TEXT" },
          { column: "CLAVE_PREDIO", value: "TEXT" },
          { column: "ESTADO", value: "TEXT" },
          { column: "STATUS", value: "TEXT" },
          { column: "TARIFA", value: "TEXT" },
          { column: "ALCANTARILLADO", value: "TEXT" },
          { column: "LECT_ACTUAL", value: "INTEGER" },
          { column: "LECT_ANTERIOR", value: "INTEGER" },
          { column: "CONSUMO_PROMEDIO", value: "REAL" },
          { column: "CONSUMO_CONTROL_MIN", value: "REAL" },
          { column: "CONSUMO_CONTROL_MAX", value: "REAL" },
          { column: "CONSUMO", value: "REAL" },
          { column: "EXONERACION", value: "TEXT" },
          { column: "TERCERA_EDAD", value: "TEXT" },
          { column: "DISCAPACIDAD", value: "TEXT" },
          { column: "DEPARTAMENTO", value: "TEXT" },
          { column: "PISO", value: "TEXT" },
          { column: "MANZANA", value: "TEXT" },
          { column: "TIPO", value: "TEXT" },
          { column: "ANIOMES", value: "TEXT" },
          { column: "ACTIVO", value: "TEXT" },
          { column: "USER_LEC", value: "TEXT" },
          { column: "FECHA_LEC", value: "TEXT" },
          { column: "X_LECTURA", value: "REAL" },
          { column: "Y_LECTURA", value: "REAL" },
          { column: "X_MEDIDOR", value: "REAL" },
          { column: "Y_MEDIDOR", value: "REAL" },
          { column: "TIPOCAUSA", value: "TEXT" },
          { column: "LEC04ID", value: "INTEGER" },
          { column: "FECHA_STRING_LEC", value: "TEXT" },
          { column: "FTOMA", value: "TEXT" },
          { column: "PORCENTAGE_CON_PROMEDIO", value: "REAL" },
          { column: "TIPONOVEDAD", value: "TEXT" }
        ]
      }
    ]
  };

  constructor(private http: HttpClient) {
    this.dbready = new BehaviorSubject(false);
    this.isWeb = false;
    this.isIOS = false;
    this.dbName = this.dbConfig.database;
    console.log('Nombre de la base de datos:', this.dbName);
  }

  async init() {
    const info = await Device.getInfo();
    const sqlite = CapacitorSQLite as any;

    if (info.platform === 'android') {
      try {
        await sqlite.requestPermissions();
      } catch (error) {
        console.log('Esta app necesita permisos para funcionar: ', error);
      }
    } else if (info.platform === 'web') {
      console.log('Inicializando WebStore para el entorno web...');
      try {
        await sqlite.initWebStore(); // Asegúrate de inicializar el WebStore
        console.log('WebStore inicializado correctamente.');
      } catch (error) {
        console.error('Error al inicializar WebStore:', error);
      }
      console.log('Plataforma:', info.platform);
    }
  }

  async setupDatabase() {
    console.log('Iniciando configuración de la base de datos...');
    const dbSetup = await Preferences.get({ key: 'first_setup_key' });

    if (!dbSetup.value) {
      console.log('No hay configuración previa, creando base de datos...');
      await this.createDatabase();
    } else {
      console.log('Configuración encontrada. Abriendo conexión...');
      try {
        await CapacitorSQLite.createConnection({ database: this.dbName });
        await CapacitorSQLite.open({ database: this.dbName });
        this.dbready.next(true); // Marca la base de datos como lista
        console.log('Base de datos lista para usar.');
      } catch (error) {
        console.error('Error al abrir la base de datos:', error);
      }
    }
  }

  async createDatabase() {
    console.log('Creando tablas de la base de datos...');
    try {
      // Crear conexión a la base de datos
      await CapacitorSQLite.createConnection({ database: this.dbName });
      await CapacitorSQLite.open({ database: this.dbName });

      // Generar las consultas de creación de tablas
      const createTableQueries = this.buildCreateTableQueries(this.dbConfig.tables);

      for (const query of createTableQueries) {
        console.log('Ejecutando consulta:', query);
        await CapacitorSQLite.run({ database: this.dbName, statement: query });
      }

      console.log('Tablas creadas con éxito.');

      // Guardar configuración inicial en preferencias
      await Preferences.set({ key: 'first_setup_key', value: '1' });
      this.dbready.next(true);
    } catch (error) {
      console.error('Error al crear la base de datos:', error);
    }
  }

  buildCreateTableQueries(tables: any[]): string[] {
    const queries: string[] = [];

    tables.forEach((table) => {
      let query = `CREATE TABLE IF NOT EXISTS ${table.name} (`;

      table.schema.forEach((column, index) => {
        query += `${column.column} ${column.value}`;
        if (index < table.schema.length - 1) query += ', ';
      });

      query += ');';
      queries.push(query);
    });

    return queries;
  }

  async guardarLecturas(lecturas: any[]) {
    const sqlite = CapacitorSQLite;
    const db = await sqlite.open({ database: this.dbName });

    try {
      for (const lectura of lecturas) {
        // Asegúrate de que el objeto "lectura" tenga los campos necesarios
        const insertQuery = `
          INSERT INTO AGUALEC_APP (
            IDCUENTA, NRO_CUENTA, NRO_MEDIDOR, CIU, CONSUMIDOR, CEDULA_RUC, EMAIL,
            PARROQUIA, SECTOR, RUTA, SEQUENCIA, DIRECCION, CLAVE_PREDIO, ESTADO,
            STATUS, TARIFA, ALCANTARILLADO, LECT_ACTUAL, LECT_ANTERIOR, CONSUMO_PROMEDIO,
            CONSUMO_CONTROL_MIN, CONSUMO_CONTROL_MAX, CONSUMO, EXONERACION, TERCERA_EDAD,
            DISCAPACIDAD, DEPARTAMENTO, PISO, MANZANA, TIPO, ANIOMES, ACTIVO, USER_LEC,
            FECHA_LEC, X_LECTURA, Y_LECTURA, X_MEDIDOR, Y_MEDIDOR, TIPOCAUSA, LEC04ID,
            FECHA_STRING_LEC, FTOMA, PORCENTAGE_CON_PROMEDIO, TIPONOVEDAD
          ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
          )`;

        // Inserta los valores de la lectura en la base de datos
        await sqlite.run({
          database: this.dbName,
          statement: insertQuery,
          values: [
            lectura.IDCUENTA, lectura.NRO_CUENTA, lectura.NRO_MEDIDOR, lectura.CIU,
            lectura.CONSUMIDOR, lectura.CEDULA_RUC, lectura.EMAIL, lectura.PARROQUIA,
            lectura.SECTOR, lectura.RUTA, lectura.SEQUENCIA, lectura.DIRECCION,
            lectura.CLAVE_PREDIO, lectura.ESTADO, lectura.STATUS, lectura.TARIFA,
            lectura.ALCANTARILLADO, lectura.LECT_ACTUAL, lectura.LECT_ANTERIOR,
            lectura.CONSUMO_PROMEDIO, lectura.CONSUMO_CONTROL_MIN, lectura.CONSUMO_CONTROL_MAX,
            lectura.CONSUMO, lectura.EXONERACION, lectura.TERCERA_EDAD, lectura.DISCAPACIDAD,
            lectura.DEPARTAMENTO, lectura.PISO, lectura.MANZANA, lectura.TIPO, lectura.ANIOMES,
            lectura.ACTIVO, lectura.USER_LEC, lectura.FECHA_LEC, lectura.X_LECTURA, lectura.Y_LECTURA,
            lectura.X_MEDIDOR, lectura.Y_MEDIDOR, lectura.TIPOCAUSA, lectura.LEC04ID,
            lectura.FECHA_STRING_LEC, lectura.FTOMA, lectura.PORCENTAGE_CON_PROMEDIO, lectura.TIPONOVEDAD
          ]
        });

      }

      console.log('Lecturas guardadas correctamente en la base de datos local.');
    } catch (error) {
      console.error('Error al guardar las lecturas en la base de datos:', error);
    }
  }
}