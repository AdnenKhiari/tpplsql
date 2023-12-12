import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFaculte, NewFaculte } from '../faculte.model';

export type PartialUpdateFaculte = Partial<IFaculte> & Pick<IFaculte, 'facno'>;

export type EntityResponseType = HttpResponse<IFaculte>;
export type EntityArrayResponseType = HttpResponse<IFaculte[]>;

@Injectable({ providedIn: 'root' })
export class FaculteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/facultes');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(faculte: NewFaculte): Observable<EntityResponseType> {
    return this.http.post<IFaculte>(this.resourceUrl, faculte, { observe: 'response' });
  }

  update(faculte: IFaculte): Observable<EntityResponseType> {
    return this.http.put<IFaculte>(`${this.resourceUrl}/${this.getFaculteIdentifier(faculte)}`, faculte, { observe: 'response' });
  }

  partialUpdate(faculte: PartialUpdateFaculte): Observable<EntityResponseType> {
    return this.http.patch<IFaculte>(`${this.resourceUrl}/${this.getFaculteIdentifier(faculte)}`, faculte, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFaculte>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFaculte[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFaculteIdentifier(faculte: Pick<IFaculte, 'facno'>): number {
    return faculte.facno;
  }

  compareFaculte(o1: Pick<IFaculte, 'facno'> | null, o2: Pick<IFaculte, 'facno'> | null): boolean {
    return o1 && o2 ? this.getFaculteIdentifier(o1) === this.getFaculteIdentifier(o2) : o1 === o2;
  }

  addFaculteToCollectionIfMissing<Type extends Pick<IFaculte, 'facno'>>(
    faculteCollection: Type[],
    ...facultesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const facultes: Type[] = facultesToCheck.filter(isPresent);
    if (facultes.length > 0) {
      const faculteCollectionIdentifiers = faculteCollection.map(faculteItem => this.getFaculteIdentifier(faculteItem)!);
      const facultesToAdd = facultes.filter(faculteItem => {
        const faculteIdentifier = this.getFaculteIdentifier(faculteItem);
        if (faculteCollectionIdentifiers.includes(faculteIdentifier)) {
          return false;
        }
        faculteCollectionIdentifiers.push(faculteIdentifier);
        return true;
      });
      return [...facultesToAdd, ...faculteCollection];
    }
    return faculteCollection;
  }
}
