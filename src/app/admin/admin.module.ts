import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared';
import { AdminArticleService } from './admin-article.service';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
// tslint:disable-next-line:max-line-length
import { AdminArticleVisualizeControlComponent } from './components/admin-article-visualize-control/admin-article-visualize-control.component';
import { AdminArticleComponent } from './components/admin-article/admin-article.component';
import { AdminArticlesListComponent } from './components/admin-articles-list/admin-articles-list.component';
import { DomIndicatorComponent } from './components/dom-indicator/dom-indicator.component';
import { SearchComponent } from './components/search/search.component';

@NgModule({
  declarations: [
    AdminComponent,
    SearchComponent,
    AdminArticlesListComponent,
    AdminArticleComponent,
    DomIndicatorComponent,
    AdminArticleVisualizeControlComponent
  ],
  imports: [CommonModule, AdminRoutingModule, SharedModule],
  providers: [AdminArticleService]
})
export class AdminModule {}
