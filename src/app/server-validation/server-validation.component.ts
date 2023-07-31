import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-server-validation',
  templateUrl: './server-validation.component.html',
  styleUrls: ['./server-validation.component.css']
})
export class ServerValidationComponent {
  servers: any[] = [];
  serversParallelBackend: any[] = [];
  serversParallelFrontend: any[] = [];
  validationInProgress = false;
  validationInProgressParallelBackend = false;
  validationInProgressParallelFrontend = false;
  validationTimeSequential: number = 0;
  validationTimeParallelBackend: number = 0;
  validationTimeParallelFrontend: number = 0;

  constructor(private http: HttpClient) { }

  validateServers() {
    this.validationInProgress = true;
    const startTime = new Date().getTime();
    this.http.post<any[]>('http://localhost:8080/validate-servers', this.servers).subscribe(
      (response) => {
        const endTime = new Date().getTime();
        this.validationTimeSequential = (endTime - startTime) / 1000; // time in seconds
        this.servers = response;
        this.validationInProgress = false;
      },
      (error) => {
        console.error(error);
        this.validationInProgress = false;
      }
    );
  }

  validateServersParallelBackend() {
    this.validationInProgressParallelBackend = true;
    const startTime = new Date().getTime();
    this.http.post<any[]>('http://localhost:8080/validate-servers-parallel', this.serversParallelBackend).subscribe(
      (response) => {
        const endTime = new Date().getTime();
        this.validationTimeParallelBackend = (endTime - startTime) / 1000; // time in seconds
        this.serversParallelBackend = response;
        this.validationInProgressParallelBackend = false;
      },
      (error) => {
        console.error(error);
        this.validationInProgressParallelBackend = false;
      }
    );
  }

  validateServersParallelFrontend() {
    this.validationInProgressParallelFrontend = true;
    const startTime = new Date().getTime();

    // Split the servers array into batches of size 5
    const serverBatches = this.chunk(this.serversParallelFrontend, 2);

    // Create an array to store our Observables
    const observables = [];

    // For each batch of servers, create an Observable that will validate that batch
    for (let serverBatch of serverBatches) {
      const observable = this.http.post<any[]>('http://localhost:8080/validate-servers', serverBatch);
      observables.push(observable);
    }

    // Use forkJoin to run all the Observables
    forkJoin(observables).subscribe(
      (responses: any[]) => {
        const endTime = new Date().getTime();
        this.validationTimeParallelFrontend = (endTime - startTime) / 1000; // time in seconds
        this.serversParallelFrontend = [].concat(...responses);
        this.validationInProgressParallelFrontend = false;
      },
      (error: any) => {
        console.error(error);
        this.validationInProgressParallelFrontend = false;
      }
    );
  }

  // Utility method to split an array into chunks
  chunk(array: any[], chunkSize: number): any[][] {
    let chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  addServer(name: string) {
    this.servers.push({ name, valid: false });
    this.serversParallelBackend.push({ name, valid: false });
    this.serversParallelFrontend.push({ name, valid: false });
  }
}
