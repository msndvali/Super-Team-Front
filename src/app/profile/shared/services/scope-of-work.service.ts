import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ScopeOfWorkService {

  constructor(private http: HttpClient) { }

  getProject(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.ApiUrl}Projects/${id}`,
    )
  }

  getOrganizationId(): Observable<any> {
    return this.http.get<any>(
      `${environment.ApiUrl}Organization`,
    )
  }

  checkJunehomes(): Observable<any> {
    return this.http.get<any>(
      `${environment.ApiUrl}User/IsJunehomes`
    )
  }

  getScopeOfWork(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.ApiUrl}Projects/${id}/ScopeOfWork`,
    ).pipe(
      map(res => {
        let apartmentScopesOfWork = res.apartmentScopesOfWork
        let livingroom = 0;
        let bedroom = 0;
        let bathroom = 0;
        let kitchen = 0;
        let countingAlphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
        let selectedRoomsIds: any = [];
        let roomIdAndScopesOfWork: any = {};
        Object.keys(res.roomIdAndScopesOfWork).forEach(roomId => {
          Object.values(res.roomIdAndScopesOfWork[roomId]).forEach((room: any) => {
            if(selectedRoomsIds.includes(roomId)) {
              if (room.roomTypeId == 1) {
                room.alphabet = roomIdAndScopesOfWork[roomId][0].alphabet;
                roomIdAndScopesOfWork[roomId].push(room);
              } else if (room.roomTypeId == 2) {
                room.alphabet = roomIdAndScopesOfWork[roomId][0].alphabet;
                roomIdAndScopesOfWork[roomId].push(room);
              } else if (room.roomTypeId == 3) {
                room.alphabet = roomIdAndScopesOfWork[roomId][0].alphabet;
                roomIdAndScopesOfWork[roomId].push(room);
              } else if (room.roomTypeId == 4) {
                room.alphabet = roomIdAndScopesOfWork[roomId][0].alphabet;
                roomIdAndScopesOfWork[roomId].push(room);
              }
            } else {
              if (room.roomTypeId == 1) {
                room.alphabet = countingAlphabet[livingroom];
                roomIdAndScopesOfWork = { ...roomIdAndScopesOfWork, [roomId]: [room] };
                selectedRoomsIds.push(roomId);
                livingroom++;
              } else if (room.roomTypeId == 2) {
                room.alphabet = countingAlphabet[bedroom];
                roomIdAndScopesOfWork = { ...roomIdAndScopesOfWork, [roomId]: [room] };
                selectedRoomsIds.push(roomId);
                bedroom++;
              } else if (room.roomTypeId == 3) {
                room.alphabet = countingAlphabet[bathroom];
                roomIdAndScopesOfWork = { ...roomIdAndScopesOfWork, [roomId]: [room] };
                selectedRoomsIds.push(roomId);
                bathroom++;
              } else if (room.roomTypeId == 4) {
                room.alphabet = countingAlphabet[kitchen];
                roomIdAndScopesOfWork = { ...roomIdAndScopesOfWork, [roomId]: [room] };
                selectedRoomsIds.push(roomId);
                kitchen++;
              }
            }
          });
        });
        let response = { apartmentScopesOfWork, roomIdAndScopesOfWork };
        return response;
      })
    )
  }

  getScopeOfWorkSelected(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.ApiUrl}Projects/${id}/ScopeOfWork`,
    )
    .pipe(
      map(res => {
        let livingroom = 0;
        let bedroom = 0;
        let bathroom = 0;
        let kitchen = 0;
        let countingAlphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

        let selectedRoomsIds: any = [];
        let selectedtempObj: any = {};

        Object.keys(res.roomIdAndScopesOfWork).forEach(roomId => {
          Object.values(res.roomIdAndScopesOfWork[roomId]).forEach((room: any) => {
            if(room.isAssignedToProject == true) {
              if(selectedRoomsIds.includes(roomId)) {
                if (room.roomTypeId == 1) {
                  room.alphabet = selectedtempObj[roomId][0].alphabet;
                  selectedtempObj[roomId].push(room);
                } else if (room.roomTypeId == 2) {
                  room.alphabet = selectedtempObj[roomId][0].alphabet;
                  selectedtempObj[roomId].push(room);
                } else if (room.roomTypeId == 3) {
                  room.alphabet = selectedtempObj[roomId][0].alphabet;
                  selectedtempObj[roomId].push(room);
                } else if (room.roomTypeId == 4) {
                  room.alphabet = selectedtempObj[roomId][0].alphabet;
                  selectedtempObj[roomId].push(room);
                }
              } else {
                if (room.roomTypeId == 1) {
                  room.alphabet = countingAlphabet[livingroom];
                  selectedtempObj = { ...selectedtempObj, [roomId]: [room] };
                  selectedRoomsIds.push(roomId);
                  livingroom++;
                } else if (room.roomTypeId == 2) {
                  room.alphabet = countingAlphabet[bedroom];
                  selectedtempObj = { ...selectedtempObj, [roomId]: [room] };
                  selectedRoomsIds.push(roomId);
                  bedroom++;
                } else if (room.roomTypeId == 3) {
                  room.alphabet = countingAlphabet[bathroom];
                  selectedtempObj = { ...selectedtempObj, [roomId]: [room] };
                  selectedRoomsIds.push(roomId);
                  bathroom++;
                } else if (room.roomTypeId == 4) {
                  room.alphabet = countingAlphabet[kitchen];
                  selectedtempObj = { ...selectedtempObj, [roomId]: [room] };
                  selectedRoomsIds.push(roomId);
                  kitchen++;
                }
              }
            }
          });
        });
        return selectedtempObj;
      })
    )
  }

  addFiles(formData: FormData, source: string): Observable<any> {
    return this.http.post<any>(
      `${environment.ApiUrl}File?blobType=${source}`, formData
    )
  }

  updateproject(upload: any): Observable<any> {
    return this.http.put<any>(
      `${environment.ApiUrl}Projects`, upload
    )
  }

  getFurniture(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.ApiUrl}Projects/${id}/Furniture`
    )
    .pipe(
      map(res => {
        const roomIdAndFurniture = res.roomIdAndFurniture;

        let selectedRoomsIds: any = [];
        let roomTotals = {};
        let total: number = 0;

        Object.keys(res.roomIdAndFurniture).forEach(roomId => {
          Object.values(res.roomIdAndFurniture[roomId]).forEach((item: any) => {
            if(item.isAssignedToProject) {
              if(selectedRoomsIds.includes(roomId)) {
                roomTotals[roomId] += item.unitPrice * item.quantity;
              } else {
                roomTotals = { ...roomTotals, [roomId]: item.unitPrice * item.quantity };
                selectedRoomsIds.push(roomId);
              }
              total += item.unitPrice * item.quantity;
            }
          });
        });

        const result = { roomIdAndFurniture, roomTotals, total: total };
        return result;
      })
    )
  }

  changeFurnitureStatus(projectId: number, status: string, roomId: any, furnitureId: number,): Observable<any> {
    return this.http.put(
      `${environment.ApiUrl}Projects/${projectId}/Furniture/${furnitureId}`,
      {
        action: status,
        roomId: roomId
      }
    )
  }

  changeScopeStatus(projectId: number, status: string, roomId: any, ScopeOfWorkId: number,): Observable<any> {
    return this.http.put(
      `${environment.ApiUrl}Projects/${projectId}/ScopeOfWork/${ScopeOfWorkId}`,
      {
        action: status,
        roomId: roomId
      }
    )
  }

  confirmProject(id: number, scopesObject: any): Observable<any> {
    return this.http.post(
      `${environment.ApiUrl}Projects/${id}/Confirm`,
      {
        roomIdAndScopesOfWork: scopesObject
      }
    )
  }

  acceptProject(id: number): Observable<any> {
    return this.http.post(
      `${environment.ApiUrl}Projects/${id}/Accept`, null
    )
  }
}
