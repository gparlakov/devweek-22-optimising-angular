import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, ReplaySubject } from 'rxjs';
import { map, mergeMap, startWith, share, take, concatMap } from 'rxjs/operators';
import { ApiService } from '../core';
import { AdminArticle } from './model/admin-article';
import { ArticleDimensionProps, ArticleDimensions } from './model/admin-article-dimensions';

@Injectable()
export class AdminArticleService {
  private searchAggregated$ = new ReplaySubject<Observable<string>>(1);
  private search$ = this.searchAggregated$.pipe(
    mergeMap(s => s),
    startWith('')
  );

  private _articles$ = new BehaviorSubject<AdminArticle[]>([]);
  articles$ = combineLatest([this._articles$, this.search$]).pipe(
    map(([articles, search]) =>
      search && search.length > 1
        ? // implement search - do search only if there is at least one char
          articles.filter(a => a.body && a.body.includes(search))
        : articles
    )
  );

  private _articleConfig$ = new BehaviorSubject<ArticleDimensions>(ArticleDimensions.default);
  articleConfig$ = this._articleConfig$.asObservable();

  private articleCache$ = new BehaviorSubject<AdminArticle[]>(undefined);

  articlesFromSearch$ = this.search$.pipe(
    concatMap(s => this.fetchArticles(100).pipe(map(a => [a, s] as [AdminArticle[], string]))),
    map(([as, s]) =>
      as.filter(
        a =>
          a.body.toLowerCase().includes(s.toLowerCase()) ||
          a.title.toLowerCase().includes(s.toLowerCase())
      )
    )
  );

  constructor(private apiClient: ApiService) {}

  onAdminEnter() {
    combineLatest([this.fetchArticles(100), this._articleConfig$])
      .pipe(
        // implement article short text
        map(([articles, config]) =>
          articles.map(a => ({ ...a, width: config.width, height: config.height }))
        )
      )
      .subscribe(
        articles => this._articles$.next(articles),
        _e => {
          // this.logger.error(e);
          // this.notification - could not load articles - try searching
        }
      );
  }

  private fetchArticles(count: number, skip?: number): Observable<AdminArticle[]> {
    skip = skip || 0;
    return (
      this.apiClient
        .get(`/articles?limit=${count}&skip=${skip}`)
        // response returns an object with articles property -> {articles: Article[]}
        .pipe(map(r => r.articles))
    );
  }

  onSearchInit(searchInput$: Observable<string>) {
    this.searchAggregated$.next(searchInput$);
  }

  onArticleChange(p: ArticleDimensionProps, v: number) {
    this._articleConfig$.next(this._articleConfig$.value.with(p, v));
  }

  article100Cache() {
    if (!this.articleCache$.value) {
      this.fetchArticles(200)
        .pipe(take(1))
        .subscribe(articles => this.articleCache$.next(articles));
    }
    return this.articleCache$;
  }
}
