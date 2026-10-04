import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Recipe } from '../../models/recipe';
import { GET_RECIPE, errorMessage } from '../../graphql/recipe.operations';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apollo: Apollo
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchRecipe(id);
    } else {
      this.router.navigate(['/']); // fallback
    }
  }

  fetchRecipe(id: string) {
    this.apollo
      .watchQuery({
        query: GET_RECIPE,
        variables: { id },
      })
      .valueChanges.subscribe({
        next: (result) => {
          this.recipe = result.data?.recipe ?? null;
          this.loading = result.loading;
          this.error = null;
        },
        error: (err) => {
          this.error = errorMessage(err);
          this.loading = false;
        },
      });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
