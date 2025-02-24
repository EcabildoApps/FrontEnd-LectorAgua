import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private userRoleSubject = new BehaviorSubject<string>('');  // Valor inicial vacío
  public userRole$ = this.userRoleSubject.asObservable();  // Observable accesible desde otros componentes

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
    const storedRole = await this.storage.get('userRole');
    if (storedRole) {
      this.userRoleSubject.next(storedRole); // Emitir el valor almacenado
    }
  }

  async rescatar(key: string): Promise<string | null> {
    return await this.storage.get(key);
  }

  async guardar(key: string, value: any) {
    await this.storage.set(key, value);
    if (key === 'userRole') {
      this.userRoleSubject.next(value); // Emitir nuevo valor cuando cambie el rol
    }
  }

  async eliminar(key: string) {
    await this.storage.remove(key);
    if (key === 'userRole') {
      this.userRoleSubject.next(''); // Resetear el rol
    }
  }
}