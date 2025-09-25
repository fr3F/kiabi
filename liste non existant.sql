SELECT 
    ic.eanCode, 
    s.styleCode,
    s.stock,
    s.size,
    s.designation,
    COUNT(ic.eanCode)  as count,
    max(ic.datemodification) as date_modif,
    COUNT(ic.epc) AS surplusnonexistant
FROM inventaire_comptage ic
LEFT JOIN inventaire_snapshot s
    ON ic.eanCode = s.eanCode AND s.idinventaire = 11
WHERE ic.idinventaire = 11
  AND s.eanCode IS NULL  
GROUP BY ic.eanCode, s.styleCode
LIMIT 0, 1000;
