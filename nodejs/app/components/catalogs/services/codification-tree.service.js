const { ClsCodification } = require('./../../../models'); // Ajustez le chemin vers vos modèles

// Fonction principale pour obtenir la structure hiérarchique
const getHierarchicalStructureCls = async () => {
    const codifications = await findAllCodifications();
    const groups = buildGroups(codifications);
    assignMarketsToGroups(codifications, groups);
    assignDepartmentsToMarkets(codifications, groups);
    assignClassesToDepartments(codifications, groups);
    return Object.values(groups);
};

async function findAllCodifications() {
    const codifications = await ClsCodification.findAll({ raw: true});
    modifyLongDescription(codifications)
    return codifications;
}

function modifyLongDescription(codifications){
    for(const codification of codifications){
        const prefix = codification.marketLongDescription + " ";
        deletePrefixDescription(codification, prefix, "department");
        deletePrefixDescription(codification, prefix, "class");
    }
}

function deletePrefixDescription(codification, prefix, attribute){
    attribute = attribute + "LongDescription";
    const newValue = codification[attribute].replace(prefix, "");
    if(newValue)
        codification[attribute] = newValue;
}

// Construction des groupes à partir des codifications
const buildGroups = (codifications) => {
    return codifications.reduce((acc, item) => {
        if (!acc[item.group]) {
            acc[item.group] = createNode(item.groupDescription, item.group, item.groupLongDescription, 'group');
        }
        return acc;
    }, {});
};

// Attribution des marchés aux groupes
const assignMarketsToGroups = (codifications, groups) => {
    codifications.forEach(item => {
        const group = groups[item.group];
        if (group) {
            const existingMarket = group.children.find(child => child.value === item.market);
            if (!existingMarket) {
                group.children.push(createNode(item.marketDescription, item.market, item.marketLongDescription, 'market'));
            }
        }
    });
};

// Attribution des départements aux marchés
const assignDepartmentsToMarkets = (codifications, groups) => {
    codifications.forEach(item => {
        const market = findOrCreateChild(groups[item.group], 'market', item.market); // Créez ou trouvez le marché
        if (market) {
            const existingDepartment = market.children.find(child => child.value === item.department);
            if (!existingDepartment) {
                market.children.push(createNode(item.departmentDescription, item.department, item.departmentLongDescription, 'department'));
            }
        }
    });
};

// Attribution des classes aux départements
const assignClassesToDepartments = (codifications, groups) => {
    codifications.forEach(item => {
        const department = findOrCreateChild(groups[item.group], 'market', item.market, 'department', item.department); // Créez ou trouvez le département
        if (department) {
            const existingClass = department.children.find(child => child.value === item.class);
            if (!existingClass) {
                department.children.push(createNode(item.classDescription, item.class, item.classLongDescription, 'class'));
            }
        }
    });
};

// Fonction pour créer un nouveau noeud
const createNode = (name, value, description, type) => {
    return {
        name,
        value,
        description,
        type,
        children: []
    };
};

// Fonction pour trouver ou créer un enfant dans un parent (en fonction des types spécifiés)
const findOrCreateChild = (parent, ...types) => {
    let current = parent;
    for (let i = 0; i < types.length; i++) {
        const type = types[i];
        const value = types[i + 1]; // La valeur associée au type (pour comparaison)
        let child = current.children.find(child => child.type === type && child.value === value);
        if (!child) {
            child = createNode(`${type} Description`, value, `${type} Long Description`, type);
            current.children.push(child);
        }
        current = child; // Passer au prochain enfant dans la hiérarchie
        i++; // Incrémenter pour sauter à la prochaine valeur
    }
    return current;
};

module.exports = {
    getHierarchicalStructureCls
};
