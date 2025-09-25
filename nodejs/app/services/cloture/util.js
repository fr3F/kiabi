const STATUT_ENCAISSEMENT = {
    aValider: "A valider",
    valide: "Validé",
    clos: "Clos"
}

// const CARACTERE_SPECIAUX = [
//     {special: "è", remplacement: "Š"},
//     {special: "é", remplacement: "‚"},
//     {special: "ô", remplacement: "“"},
//     {special: "ê", remplacement: "ˆ"},
//     {special: "à", remplacement: "…"},
//     {special: "â", remplacement: "ƒ"},
// ]

function remplacerCaracteresSpeciaux(caractereSpeciaux, texte) {
    // Parcourt chaque entrée de la table de correspondance
    caractereSpeciaux.forEach((correspondance) => {
        const caractereSpecial = correspondance.special;
        const caractereRemplacement = correspondance.remplacement;
        const regex = new RegExp(caractereSpecial, 'g');
        texte = texte.replace(regex, caractereRemplacement);
    });
    
    // Retourne le texte modifié
    return texte;
}

module.exports = {
    STATUT_ENCAISSEMENT,
    remplacerCaracteresSpeciaux
}