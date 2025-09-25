const { QueryTypes } = require("sequelize/dist");
const db  = require("../../models");
const Menu = db.menu;
const queryInterface = db.sequelize.getQueryInterface();

// Menu pour le site admin

// Recuperer les menus d'un role
function getMenuRole(id){
    // if(id == 1){
    //     return db.sequelize.query("SELECT * from menus", {type: QueryTypes.SELECT});
    // }
    return db.sequelize.query("SELECT * from v_menu_roles where roleId=" + id + " ORDER BY ordre ASC", {type: QueryTypes.SELECT});
};

// Recuperer tous les menus 
async function getAllMenu(){
    let menu  = await db.sequelize.query("SELECT * from menus", {type: QueryTypes.SELECT});
    setMenuHierrarchy(menu);
    return menu;
}

// Recuperer les menus d'un role avec hierrarchie
    // ex: Menu 1:
            // - sous menu
            // - sous menu
async function getMenuRoleAvecHierrarchie(id){
    let menus = await getMenuRole(id);
    setMenuHierrarchy(menus);
    return menus;
}

// Modifier l'hierrarchie de tableau de menus
function setMenuHierrarchy(menu){
    initializeSubItemsMenu(menu);
    for(let i = 0; i < menu.length; i++){
        if(menu[i].parentId){
            let parent = getElementById(menu[i].parentId, menu);
            parent.subItems.push(menu[i]);    
        }
    }
    setHierrarchySansParent(menu);
}

// Recuperer un element par id
function getElementById(id, tab){
    for(let i = 0; i < tab.length; i++){
        if(id == tab[i].id)
            return tab[i];
    }
    return null;
}

// Initialiser les subitem des menus
function initializeSubItemsMenu(menu){
    for(let i = 0; i < menu.length; i++){
        menu[i].subItems = [];
    }
}

// Set hierrarchie sans parent
    // retourner seulement les menus sans parent avec leurs enfants
function setHierrarchySansParent(tab){
    let n = tab.length;
    let ind = [];
    for(let i = 0; i <n; i ++){
        if(tab[i].parentId){
            tab.splice(i, 1);
            i --;
            n --;
        }
    }
}

// Recuperer les menus d'un utilisateur
async function getMenuUser(id){
    let user = await db.user.findByPk(id);
    if(!user) throw new Error("Vous n'étes pas connectés");
    let menu = await getMenuRoleAvecHierrarchie(user.idRole);
    return menu;
}

// Generer menu role(avec checked)
function genererMenuRole(tab, menus, roleId){
    for(let i = 0; i < menus.length; i++){
        if(menus[i].checked){
            tab.push({roleId: roleId, menuId: menus[i].id});
            genererMenuRole(tab, menus[i].subItems, roleId)
        }
    }
}

// Modifier menu role
async function updateMenuRole(roleId, menus){
    tab = [];
    genererMenuRole(tab, menus, roleId);
    await db.menuRole.destroy({where: {roleId: roleId}});
    if(tab.length == 0) return;
    await queryInterface.bulkInsert("menu_roles", tab);
}

// Tester si l'user a l'accès a la page
async function testAcces(roleId, menuId){
    let menu = await db.menuRole.findOne({where: {roleId, menuId}});
    if(!menu)
        return false;
    return true;
}

module.exports = {
    getMenuRoleAvecHierrarchie,
    getMenuUser,
    getAllMenu,
    getMenuRole,
    updateMenuRole,
    testAcces
}