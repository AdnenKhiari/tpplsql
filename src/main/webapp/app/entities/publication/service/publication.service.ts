import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPublication, NewPublication } from '../publication.model';

export type PartialUpdatePublication = Partial<IPublication> & Pick<IPublication, 'pubno'>;

type RestOf<T extends IPublication | NewPublication> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestPublication = RestOf<IPublication>;

export type NewRestPublication = RestOf<NewPublication>;

export type PartialUpdateRestPublication = RestOf<PartialUpdatePublication>;

export type EntityResponseType = HttpResponse<IPublication>;
export type EntityArrayResponseType = HttpResponse<IPublication[]>;

@Injectable({ providedIn: 'root' })
export class PublicationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/publications');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(publication: NewPublication): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(publication);
    return this.http
      .post<RestPublication>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(publication: IPublication): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(publication);
    return this.http
      .put<RestPublication>(`${this.resourceUrl}/${this.getPublicationIdentifier(publication)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(publication: PartialUpdatePublication): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(publication);
    return this.http
      .patch<RestPublication>(`${this.resourceUrl}/${this.getPublicationIdentifier(publication)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPublication>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPublication[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPublicationIdentifier(publication: Pick<IPublication, 'pubno'>): number {
    return publication.pubno;
  }

  comparePublication(o1: Pick<IPublication, 'pubno'> | null, o2: Pick<IPublication, 'pubno'> | null): boolean {
    return o1 && o2 ? this.getPublicationIdentifier(o1) === this.getPublicationIdentifier(o2) : o1 === o2;
  }

  addPublicationToCollectionIfMissing<Type extends Pick<IPublication, 'pubno'>>(
    publicationCollection: Type[],
    ...publicationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const publications: Type[] = publicationsToCheck.filter(isPresent);
    if (publications.length > 0) {
      const publicationCollectionIdentifiers = publicationCollection.map(
        publicationItem => this.getPublicationIdentifier(publicationItem)!,
      );
      const publicationsToAdd = publications.filter(publicationItem => {
        const publicationIdentifier = this.getPublicationIdentifier(publicationItem);
        if (publicationCollectionIdentifiers.includes(publicationIdentifier)) {
          return false;
        }
        publicationCollectionIdentifiers.push(publicationIdentifier);
        return true;
      });
      return [...publicationsToAdd, ...publicationCollection];
    }
    return publicationCollection;
  }

  protected convertDateFromClient<T extends IPublication | NewPublication | PartialUpdatePublication>(publication: T): RestOf<T> {
    return {
      ...publication,
      date: publication.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restPublication: RestPublication): IPublication {
    return {
      ...restPublication,
      date: restPublication.date ? dayjs(restPublication.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPublication>): HttpResponse<IPublication> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPublication[]>): HttpResponse<IPublication[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
