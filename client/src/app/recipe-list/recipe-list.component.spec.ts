import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';

import { RecipeListComponent } from './recipe-list.component';
import { DELETE_RECIPE, GET_RECIPES } from '../graphql/recipe.operations';
import { Recipe } from '../models/recipe';

const recipe = (id: string, title: string): Recipe => ({
  __typename: 'Recipe',
  id,
  title,
  description: null,
  category: 'Dinner',
  cookTime: 20,
  ingredients: ['Rice'],
  steps: [],
  imageUrl: null,
  createdAt: null,
} as Recipe);

describe('RecipeListComponent', () => {
  let component: RecipeListComponent;
  let fixture: ComponentFixture<RecipeListComponent>;
  let controller: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApolloTestingModule, RouterTestingModule],
      declarations: [RecipeListComponent],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
    fixture = TestBed.createComponent(RecipeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => controller.verify());

  it('renders the recipes returned by the query', fakeAsync(() => {
    controller.expectOne(GET_RECIPES).flush({
      data: { recipes: [recipe('1', 'Dal'), recipe('2', 'Poha')] },
    });
    tick();
    fixture.detectChanges();

    const titles = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('.recipe-card h3')
    ).map((el) => el.textContent?.trim());
    expect(titles).toEqual(['Dal', 'Poha']);
  }));

  it('asks for confirmation inline, then deletes and refetches the list', fakeAsync(() => {
    controller.expectOne(GET_RECIPES).flush({
      data: { recipes: [recipe('1', 'Dal'), recipe('2', 'Poha')] },
    });
    tick();
    fixture.detectChanges();

    const event = new MouseEvent('click');
    component.askDelete('1', event);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('.confirm-delete')).not.toBeNull();

    component.confirmDelete('1', event);
    const op = controller.expectOne(DELETE_RECIPE);
    expect(op.operation.variables).toEqual({ id: '1' });
    op.flush({ data: { deleteRecipe: true } });
    tick();

    // The list is refreshed from the server rather than edited by hand.
    controller.expectOne(GET_RECIPES).flush({ data: { recipes: [recipe('2', 'Poha')] } });
    tick();
    fixture.detectChanges();

    expect(component.recipes.map((r) => r.title)).toEqual(['Poha']);
    expect(component.confirmingId).toBeNull();
  }));

  it('shows an inline error when loading fails', fakeAsync(() => {
    controller.expectOne(GET_RECIPES).graphqlErrors([{ message: 'boom' } as never]);
    tick();
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('.message.error')?.textContent).toContain('boom');
  }));
});
