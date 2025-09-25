import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './dashboards/default/default.component';
import { ProfilComponent } from './profil/profil.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DefaultComponent },
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  { path: 'profil', component: ProfilComponent },

  { path: 'data-transferts', loadChildren: () => import('./../modules/data-transfert/data-transfert.module').then(m => m.DataTransfertModule)},
  { path: 'catalogs', loadChildren: () => import('./../modules/catalog/catalog.module').then(m => m.CatalogModule)},
  { path: 'shipments', loadChildren: () => import('./../modules/shipment/shipment.module').then(m => m.ShipmentModule)},
  { path: 'sales', loadChildren: () => import('./../modules/sale/sale.module').then(m => m.SaleModule)},

  { path: 'magasin', loadChildren: () => import('./../modules/param/magasin/magasin.module').then(m => m.MagasinModule) },

  { path: 'mode-paiement', loadChildren: () => import('./../modules/param/mode-paiement/mode-paiement.module').then(m => m.ModePaiementModule) },

  { path: 'carte-fidelite', loadChildren: () => import('./../pages/gifi/client-vip/client-vip.module').then(m => m.ClientVipModule) },

  { path: 'cloture', loadChildren: () => import('./cloture/cloture.module').then(m => m.ClotureModule) },
  { path: 'reporting', loadChildren: () => import('./reporting/reporting.module').then(m => m.ReportingPageModule) },

  { path: 'inventaire', loadChildren: () => import('./inventaire/inventaire.module').then(m => m.InventaireModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
