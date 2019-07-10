import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProdutosComponent } from './produtos/produtos.component';

const routes: Routes = [
  {
    path: 'produtos',
    component: ProdutosComponent,
    data: { title: 'Lista de Produtos' }
  }, 
  { path: '',
    redirectTo: '/produtos',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
