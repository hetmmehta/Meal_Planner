import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { provideGraphQL } from './graphql.module';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { AddRecipeComponent } from './pages/add-recipe/add-recipe.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent, RecipeListComponent, AddRecipeComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule, AppRoutingModule],
  providers: [provideGraphQL()],
  bootstrap: [AppComponent],
})
export class AppModule {}
