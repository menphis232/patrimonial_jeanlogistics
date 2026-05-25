import { Route } from '@angular/router';
import { StoreRecipeComponent } from './pages/store-recipe/store-recipe.component';



export const RecipeRoutes: Route[] = [
    {
        path: '',
        children: [
  
            {
                path: 'recipe/:medical_consultation_id',
                component: StoreRecipeComponent,
                data: {
                    title: 'Generar receta médica',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Generar receta médica' },
                    ],
                },
            },
        ]
    },
];
