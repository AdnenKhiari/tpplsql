import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPublier, NewPublier } from '../publier.model';

export type PartialUpdatePublier = Partial<IPublier> & Pick<IPublier, 'pubId'>;

export type EntityResponseType = HttpResponse<IPublier>;
export type EntityArrayResponseType = HttpResponse<IPublier[]>;

@Injectable({ providedIn: 'root' })
export class PublierService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/publiers');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(publier: NewPublier): Observable<EntityResponseType> {
    return this.http.post<IPublier>(this.resourceUrl, publier, { observe: 'response' });
  }

  update(publier: IPublier): Observable<EntityResponseType> {
    return this.http.put<IPublier>(`${this.resourceUrl}/${this.getPublierIdentifier(publier)}`, publier, { observe: 'response' });
  }

  partialUpdate(publier: PartialUpdatePublier): Observable<EntityResponseType> {
    return this.http.patch<IPublier>(`${this.resourceUrl}/${this.getPublierIdentifier(publier)}`, publier, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPublier>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPublier[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPublierIdentifier(publier: Pick<IPublier, 'pubId'>): number {
    return publier.pubId;
  }

  comparePublier(o1: Pick<IPublier, 'pubId'> | null, o2: Pick<IPublier, 'pubId'> | null): boolean {
    return o1 && o2 ? this.getPublierIdentifier(o1) === this.getPublierIdentifier(o2) : o1 === o2;
  }

  addPublierToCollectionIfMissing<Type extends Pick<IPublier, 'pubId'>>(
    publierCollection: Type[],
    ...publiersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const publiers: Type[] = publiersToCheck.filter(isPresent);
    if (publiers.length > 0) {
      const publierCollectionIdentifiers = publierCollection.map(publierItem => this.getPublierIdentifier(publierItem)!);
      const publiersToAdd = publiers.filter(publierItem => {
        const publierIdentifier = this.getPublierIdentifier(publierItem);
        if (publierCollectionIdentifiers.includes(publierIdentifier)) {
          return false;
        }
        publierCollectionIdentifiers.push(publierIdentifier);
        return true;
      });
      return [...publiersToAdd, ...publierCollection];
    }
    return publierCollection;
  }
}
