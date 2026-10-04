import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';

import { AddRecipeComponent } from './add-recipe.component';
import { ADD_RECIPE } from '../../graphql/recipe.operations';

describe('AddRecipeComponent', () => {
  let component: AddRecipeComponent;
  let fixture: ComponentFixture<AddRecipeComponent>;
  let controller: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApolloTestingModule, RouterTestingModule, FormsModule],
      declarations: [AddRecipeComponent],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
    fixture = TestBed.createComponent(AddRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => controller.verify());

  it('starts in "add" mode', fakeAsync(() => {
    expect(component.isEdit).toBeFalse();
  }));

  it('shows an inline error and does not submit without a title', fakeAsync(() => {
    component.recipe.ingredients = ['Rice'];
    component.onSubmit();
    tick();
    expect(component.errorMsg).toContain('title');
    controller.expectNone(ADD_RECIPE);
  }));

  it('shows an inline error and does not submit without ingredients', fakeAsync(() => {
    component.recipe.title = 'Rice';
    component.recipe.ingredients = ['  '];
    component.onSubmit();
    tick();
    expect(component.errorMsg).toContain('ingredient');
    controller.expectNone(ADD_RECIPE);
  }));

  it('sends a trimmed input with blank rows removed', fakeAsync(() => {
    component.recipe.title = '  Jeera Rice ';
    component.recipe.ingredients = ['Rice', '', ' Cumin '];
    component.recipe.steps = ['Cook rice', ''];
    component.onSubmit();
    tick();

    const op = controller.expectOne(ADD_RECIPE);
    expect(op.operation.variables['input']).toEqual(
      jasmine.objectContaining({
        title: 'Jeera Rice',
        ingredients: ['Rice', 'Cumin'],
        steps: ['Cook rice'],
      })
    );
  }));

  it('shows the server error message inline', fakeAsync(() => {
    component.recipe.title = 'Rice';
    component.recipe.ingredients = ['Rice'];
    component.onSubmit();
    tick();

    controller.expectOne(ADD_RECIPE).graphqlErrors([{ message: 'Cook time must be between 0 and 1440 minutes' } as never]);
    tick();
    expect(component.errorMsg).toContain('Cook time');
    expect(component.loading).toBeFalse();
  }));
});
