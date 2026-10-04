import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

const GET_RECIPE_BY_ID = gql`
  query Recipe($id: ID!) {
    recipe(id: $id) {
      id
      title
      description
      category
      cookTime
      ingredients
      steps
      imageUrl
      createdAt
    }
  }
`;

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: any = null;
  loading = true;
  error: any;

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
        query: GET_RECIPE_BY_ID,
        variables: { id },
      })
      .valueChanges.subscribe({
        next: (result: any) => {
          this.recipe = result?.data?.recipe;
          this.loading = result.loading;
          this.error = null;
        },
        error: (err) => {
          console.error('GraphQL error:', err);
          this.error = err;
          this.loading = false;
        },
      });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
