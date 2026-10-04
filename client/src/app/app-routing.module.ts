import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { AddRecipeComponent } from './pages/add-recipe/add-recipe.component';
import { RecipeDetailComponent } from './pages/recipe-detail/recipe-detail.component';

const routes: Routes = [
  { path: '', component: RecipeListComponent },
  { path: 'add-recipe', component: AddRecipeComponent },
  { path: 'recipe/:id', component: RecipeDetailComponent },
  { path: 'recipe/:id/edit', component: AddRecipeComponent },
  { path: '**', redirectTo: '' }, // fallback
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
