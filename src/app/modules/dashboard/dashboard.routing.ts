import { Route } from "@angular/router";
import { MainComponent } from "./pages/main/main.component";


export const dashboardRouting: Route[] = [
    {
        path     : '',
        component: MainComponent,
        data: {
            title: 'Dashboard metricas',
        }
    },
];