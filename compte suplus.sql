      select  sum(surplus) as total_surplus from (
      SELECT snap.stock as theorique, (
      SELECT count(epc) as inventaire FROM kiabi.inventaire_comptage where idinventaire=:idinventaire and eanCode=snap.eanCode) as inventaire,
      ((SELECT count(epc) as inventaire FROM kiabi.inventaire_comptage where idinventaire=:idinventaire and eanCode=snap.eanCode) - snap.stock ) 	as surplus
      FROM kiabi.inventaire_snapshot snap 
      left join kiabi.inventaire i on i.idinventaire = snap.idinventaire
      WHERE i.idinventaire=:idinventaire) as a;