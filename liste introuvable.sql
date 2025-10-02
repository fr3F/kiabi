SELECT 
    snap.eanCode,
    snap.styleCode,
    snap.stock,
    snap.size,
    snap.designation,
    (snap.stock - (
        SELECT COUNT(epc) 
        FROM kiabi.inventaire_comptage ic 
        WHERE ic.idinventaire = i.idinventaire 
          AND ic.eanCode = snap.eanCode
    )) AS introuvable,
    (
        SELECT COUNT(epc) 
        FROM kiabi.inventaire_comptage ic 
        WHERE ic.idinventaire = i.idinventaire 
          AND ic.eanCode = snap.eanCode
    ) AS counted_qty
FROM kiabi.inventaire_snapshot snap
LEFT JOIN kiabi.inventaire i 
    ON i.idinventaire = snap.idinventaire
WHERE i.idinventaire = 11
  AND (
        SELECT COUNT(epc) 
        FROM kiabi.inventaire_comptage ic 
        WHERE ic.idinventaire = i.idinventaire 
          AND ic.eanCode = snap.eanCode
     ) > 0
HAVING introuvable > 0;
