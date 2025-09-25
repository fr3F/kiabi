import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 2,
        label: 'Tableau de bord',
        icon: 'bx-home-circle',
        link: '/dashboard',
    },
    // {
    //     id: 3,
    //     label: 'Catalogues',
    //     icon: 'bx-data',
    //     subItems: [
    //         {
    //             id: 4,
    //             label: 'Liste des produits',
    //             link: '/catalog/product-list',
    //             parentId: 3
    //         },
    //         {
    //             id: 5,
    //             label: 'Ajouter un produit',
    //             link: '/catalog/product-add',
    //             parentId: 3
    //         },
    //         {
    //             id: 6,
    //             label: 'Liste des catégories',
    //             link: '/catalog/category-list',
    //             parentId: 3
    //         },
    //         {
    //             id: 7,
    //             label: 'Ajouter une catégorie',
    //             link: '/catalog/category-add',
    //             parentId: 3
    //         },
    //         {
    //             id: 17,
    //             label: 'Modification catégories produit',
    //             link: '/catalog/modifier-categorie-produit',
    //             parentId: 3
    //         },
    //     ]
    // },
    {
        id: 8,
        label: 'Utilisateurs',
        icon: 'bx-user-circle',
        subItems: [
            {
                id: 9,
                label: 'Liste des utilisateurs',
                link: '/user/user-list',
                parentId: 8
            },
            {
                id: 10,
                label: 'Ajouter un utilisateur',
                link: '/user/user-add',
                parentId: 8,
            },
        ]
    },
];
