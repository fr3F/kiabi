    select  sum(introuvable) AS total_introuvable from (
    SELECT 
    ( (SELECT count(epc) as inventaire FROM kiabi.inventaire_comptage where idinventaire=i.idinventaire and eanCode=snap.eanCode) - snap.stock ) 	as introuvable
    FROM kiabi.inventaire_snapshot snap 
    left join kiabi.inventaire i on i.idinventaire = snap.idinventaire
    WHERE i.idinventaire=11 AND 
    (SELECT count(epc) as inventaire FROM kiabi.inventaire_comptage where idinventaire=i.idinventaire and eanCode=snap.eanCode)  > 0
    ) as b where introuvable > 0 ;