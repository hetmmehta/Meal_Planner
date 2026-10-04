import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { Recipe, RecipeInput } from '../../models/recipe';
import {
  ADD_RECIPE,
  GET_RECIPE,
  GET_RECIPES,
  UPDATE_RECIPE,
  errorMessage,
} from '../../graphql/recipe.operations';

interface RecipeForm {
  title: string;
  description: string;
  category: string;
  cookTime: number | null;
  ingredients: string[];
  steps: string[];
  imageUrl: string;
}

const MAX_IMAGE_BYTES = 1024 * 1024; // keep inline images small enough for the API

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.css'],
})
export class AddRecipeComponent implements OnInit {
  recipe: RecipeForm = {
    title: '',
    description: '',
    category: '',
    cookTime: null,
    ingredients: [''],
    steps: [''],
    imageUrl: '',
  };

  categories = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Other'];
  /** Set when editing an existing recipe (route /recipe/:id/edit). */
  editId: string | null = null;
  loading = false;
  successMsg = '';
  errorMsg = '';

  constructor(
    private apollo: Apollo,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.editId = this.route.snapshot.paramMap.get('id');
    if (this.editId) this.loadRecipe(this.editId);
  }

  get isEdit() {
    return this.editId !== null;
  }

  private loadRecipe(id: string) {
    this.loading = true;
    this.apollo.query({ query: GET_RECIPE, variables: { id } }).subscribe({
      next: ({ data }) => {
        this.loading = false;
        if (data?.recipe) this.fillForm(data.recipe);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = errorMessage(err);
      },
    });
  }

  // Copy arrays: results from the Apollo cache are read-only.
  private fillForm(r: Recipe) {
    this.recipe = {
      title: r.title,
      description: r.description ?? '',
      category: r.category ?? '',
      cookTime: r.cookTime ?? null,
      ingredients: r.ingredients.length ? [...r.ingredients] : [''],
      steps: r.steps?.length ? [...r.steps] : [''],
      imageUrl: r.imageUrl ?? '',
    };
  }

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

  // Track rows by position so inputs keep focus while typing.
  trackByIndex(index: number) {
    return index;
  }

  // --- Image Upload ---
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      this.errorMsg = 'Please choose an image under 1 MB, or paste an image URL instead.';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.recipe.imageUrl = reader.result as string; // stored inline as a data URL
    };
    reader.readAsDataURL(file);
  }

  private toInput(): RecipeInput {
    const clean = (items: string[]) => items.map((i) => i.trim()).filter(Boolean);
    return {
      title: this.recipe.title.trim(),
      description: this.recipe.description.trim() || null,
      category: this.recipe.category || null,
      cookTime: this.recipe.cookTime ?? null,
      ingredients: clean(this.recipe.ingredients),
      steps: clean(this.recipe.steps),
      imageUrl: this.recipe.imageUrl.trim() || null,
    };
  }

  // --- Submit Recipe ---
  onSubmit() {
    this.errorMsg = '';
    this.successMsg = '';
    const input = this.toInput();

    if (!input.title) {
      this.errorMsg = 'Please give the recipe a title.';
      return;
    }
    if (!input.ingredients.length) {
      this.errorMsg = 'Add at least one ingredient.';
      return;
    }

    this.loading = true;
    // Refetch the list so the home page shows the change straight away.
    const refetch = { refetchQueries: [{ query: GET_RECIPES }], awaitRefetchQueries: true };
    const request$: Observable<unknown> = this.editId
      ? this.apollo.mutate({ mutation: UPDATE_RECIPE, variables: { id: this.editId, input }, ...refetch })
      : this.apollo.mutate({ mutation: ADD_RECIPE, variables: { input }, ...refetch });

    request$.subscribe({
      next: () => {
        this.successMsg = this.isEdit ? '✅ Recipe updated!' : '✅ Recipe added successfully!';
        this.loading = false;
        const target = this.editId ? ['/recipe', this.editId] : ['/'];
        setTimeout(() => this.router.navigate(target), 1200);
      },
      error: (err) => {
        this.errorMsg = errorMessage(err);
        this.loading = false;
      },
    });
  }
}
