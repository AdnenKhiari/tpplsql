import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChercheur, NewChercheur } from '../chercheur.model';

export type PartialUpdateChercheur = Partial<IChercheur> & Pick<IChercheur, 'chno'>;

type RestOf<T extends IChercheur | NewChercheur> = Omit<T, 'daterecrut'> & {
  daterecrut?: string | null;
};

export type RestChercheur = RestOf<IChercheur>;

export type NewRestChercheur = RestOf<NewChercheur>;

export type PartialUpdateRestChercheur = RestOf<PartialUpdateChercheur>;

export type EntityResponseType = HttpResponse<IChercheur>;
export type EntityArrayResponseType = HttpResponse<IChercheur[]>;

@Injectable({ providedIn: 'root' })
export class ChercheurService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/chercheurs');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(chercheur: NewChercheur): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(chercheur);
    return this.http
      .post<RestChercheur>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(chercheur: IChercheur): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(chercheur);
    return this.http
      .put<RestChercheur>(`${this.resourceUrl}/${this.getChercheurIdentifier(chercheur)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(chercheur: PartialUpdateChercheur): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(chercheur);
    return this.http
      .patch<RestChercheur>(`${this.resourceUrl}/${this.getChercheurIdentifier(chercheur)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestChercheur>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestChercheur[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getChercheurIdentifier(chercheur: Pick<IChercheur, 'chno'>): number {
    return chercheur.chno;
  }

  compareChercheur(o1: Pick<IChercheur, 'chno'> | null, o2: Pick<IChercheur, 'chno'> | null): boolean {
    return o1 && o2 ? this.getChercheurIdentifier(o1) === this.getChercheurIdentifier(o2) : o1 === o2;
  }

  addChercheurToCollectionIfMissing<Type extends Pick<IChercheur, 'chno'>>(
    chercheurCollection: Type[],
    ...chercheursToCheck: (Type | null | undefined)[]
  ): Type[] {
    const chercheurs: Type[] = chercheursToCheck.filter(isPresent);
    if (chercheurs.length > 0) {
      const chercheurCollectionIdentifiers = chercheurCollection.map(chercheurItem => this.getChercheurIdentifier(chercheurItem)!);
      const chercheursToAdd = chercheurs.filter(chercheurItem => {
        const chercheurIdentifier = this.getChercheurIdentifier(chercheurItem);
        if (chercheurCollectionIdentifiers.includes(chercheurIdentifier)) {
          return false;
        }
        chercheurCollectionIdentifiers.push(chercheurIdentifier);
        return true;
      });
      return [...chercheursToAdd, ...chercheurCollection];
    }
    return chercheurCollection;
  }

  protected convertDateFromClient<T extends IChercheur | NewChercheur | PartialUpdateChercheur>(chercheur: T): RestOf<T> {
    return {
      ...chercheur,
      daterecrut: chercheur.daterecrut?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restChercheur: RestChercheur): IChercheur {
    return {
      ...restChercheur,
      daterecrut: restChercheur.daterecrut ? dayjs(restChercheur.daterecrut) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestChercheur>): HttpResponse<IChercheur> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestChercheur[]>): HttpResponse<IChercheur[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
