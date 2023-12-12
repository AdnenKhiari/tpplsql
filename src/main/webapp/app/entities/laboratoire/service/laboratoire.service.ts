import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILaboratoire, NewLaboratoire } from '../laboratoire.model';

export type PartialUpdateLaboratoire = Partial<ILaboratoire> & Pick<ILaboratoire, 'labno'>;

export type EntityResponseType = HttpResponse<ILaboratoire>;
export type EntityArrayResponseType = HttpResponse<ILaboratoire[]>;

@Injectable({ providedIn: 'root' })
export class LaboratoireService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/laboratoires');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(laboratoire: NewLaboratoire): Observable<EntityResponseType> {
    return this.http.post<ILaboratoire>(this.resourceUrl, laboratoire, { observe: 'response' });
  }

  update(laboratoire: ILaboratoire): Observable<EntityResponseType> {
    return this.http.put<ILaboratoire>(`${this.resourceUrl}/${this.getLaboratoireIdentifier(laboratoire)}`, laboratoire, {
      observe: 'response',
    });
  }

  partialUpdate(laboratoire: PartialUpdateLaboratoire): Observable<EntityResponseType> {
    return this.http.patch<ILaboratoire>(`${this.resourceUrl}/${this.getLaboratoireIdentifier(laboratoire)}`, laboratoire, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILaboratoire>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILaboratoire[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLaboratoireIdentifier(laboratoire: Pick<ILaboratoire, 'labno'>): number {
    return laboratoire.labno;
  }

  compareLaboratoire(o1: Pick<ILaboratoire, 'labno'> | null, o2: Pick<ILaboratoire, 'labno'> | null): boolean {
    return o1 && o2 ? this.getLaboratoireIdentifier(o1) === this.getLaboratoireIdentifier(o2) : o1 === o2;
  }

  addLaboratoireToCollectionIfMissing<Type extends Pick<ILaboratoire, 'labno'>>(
    laboratoireCollection: Type[],
    ...laboratoiresToCheck: (Type | null | undefined)[]
  ): Type[] {
    const laboratoires: Type[] = laboratoiresToCheck.filter(isPresent);
    if (laboratoires.length > 0) {
      const laboratoireCollectionIdentifiers = laboratoireCollection.map(
        laboratoireItem => this.getLaboratoireIdentifier(laboratoireItem)!,
      );
      const laboratoiresToAdd = laboratoires.filter(laboratoireItem => {
        const laboratoireIdentifier = this.getLaboratoireIdentifier(laboratoireItem);
        if (laboratoireCollectionIdentifiers.includes(laboratoireIdentifier)) {
          return false;
        }
        laboratoireCollectionIdentifiers.push(laboratoireIdentifier);
        return true;
      });
      return [...laboratoiresToAdd, ...laboratoireCollection];
    }
    return laboratoireCollection;
  }
}
