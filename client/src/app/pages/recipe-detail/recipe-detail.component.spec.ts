import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';

import { RecipeDetailComponent } from './recipe-detail.component';
import { GET_RECIPE } from '../../graphql/recipe.operations';

describe('RecipeDetailComponent', () => {
  let fixture: ComponentFixture<RecipeDetailComponent>;
  let controller: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApolloTestingModule, RouterTestingModule],
      declarations: [RecipeDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: 'abc' }) } } },
      ],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
    fixture = TestBed.createComponent(RecipeDetailComponent);
    fixture.detectChanges();
  });

  afterEach(() => controller.verify());

  it('loads the recipe from the route id and shows its steps', fakeAsync(() => {
    const op = controller.expectOne(GET_RECIPE);
    expect(op.operation.variables).toEqual({ id: 'abc' });
    op.flush({
      data: {
        recipe: {
          __typename: 'Recipe',
          id: 'abc',
          title: 'Masala Chai',
          description: 'Spiced tea',
          category: 'Breakfast',
          cookTime: 10,
          ingredients: ['Tea', 'Milk'],
          steps: ['Boil', 'Strain'],
          imageUrl: null,
          createdAt: null,
        },
      },
    });
    tick();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Masala Chai');
    expect(el.querySelectorAll('ol li').length).toBe(2);
  }));

  it('shows an inline error for a missing recipe', fakeAsync(() => {
    controller.expectOne(GET_RECIPE).graphqlErrors([{ message: 'Recipe abc not found' } as never]);
    tick();
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('.message.error')?.textContent).toContain('not found');
  }));
});
