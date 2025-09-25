SELECT 
    snap.eanCode,
    snap.color,
    snap.designation,
    snap.styleCode,
    snap.size,
    snap.stock,
    c.count_epc AS counted_qty,
    (c.count_epc - snap.stock) AS introuvable,
    c.last_modif
FROM kiabi.inventaire_snapshot snap
JOIN (
    SELECT 
        eanCode,
        idinventaire,
        COUNT(*) AS count_epc,
        MAX(datemodification) AS last_modif
    FROM kiabi.inventaire_comptage
    WHERE idinventaire = 11
    GROUP BY eanCode, idinventaire
) c ON c.eanCode = snap.eanCode AND c.idinventaire = snap.idinventaire
WHERE snap.idinventaire = 11
  AND (c.count_epc - snap.stock) > 0
ORDER BY snap.eanCode;
