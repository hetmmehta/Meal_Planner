import { Component } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Router } from '@angular/router';

const ADD_RECIPE = gql`
  mutation AddRecipe($input: RecipeInput!) {
    addRecipe(input: $input) {
      id
      title
      category
      cookTime
      imageUrl
    }
  }
`;

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.css'],
})
export class AddRecipeComponent {
  recipe = {
    title: '',
    description: '',
    category: '',
    cookTime: 0,
    ingredients: [''],
    steps: [''],
    imageUrl: '',
  };

  categories = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Other'];
  loading = false;
  successMsg = '';
  imagePreview: string | null = null;

  constructor(private apollo: Apollo, private router: Router) {}

  // --- Form helpers ---
  addIngredient() {
    this.recipe.ingredients.push('');
  }

  removeIngredient(index: number) {
    this.recipe.ingredients.splice(index, 1);
  }

  addStep() {
    this.recipe.steps.push('');
  }

  removeStep(index: number) {
    this.recipe.steps.splice(index, 1);
  }

  onIngredientChange(index: number, value: string) {
    this.recipe.ingredients[index] = value;
  }

  onStepChange(index: number, value: string) {
    this.recipe.steps[index] = value;
  }

  // --- Image Upload ---
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.recipe.imageUrl = this.imagePreview; // base64 preview stored as imageUrl
      };
      reader.readAsDataURL(file);
    }
  }

  // --- Submit Recipe ---
  onSubmit() {
    if (!this.recipe.title.trim() || !this.recipe.ingredients.length) return;

    this.loading = true;
    this.apollo
      .mutate({
        mutation: ADD_RECIPE,
        variables: { input: this.recipe },
      })
      .subscribe({
        next: () => {
          this.successMsg = '✅ Recipe added successfully!';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/']), 1200);
        },
        error: (err) => {
          console.error('❌ Error adding recipe:', err);
          this.loading = false;
        },
      });
  }
}
