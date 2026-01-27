import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private config: any;

  constructor(private http: HttpClient) { }

    loadConfig() {
      return firstValueFrom(this.http.get('/config.json'))
        .then(config => {
          this.config = config;
        });
    }

    get baseURL() {
      return this.config?.baseURL;
    }
}
