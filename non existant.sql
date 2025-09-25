      USE KIABI1;
      select sum(surplusnonexistant) as surplus from (
      SELECT COUNT(epc) as surplusnonexistant FROM inventaire_comptage where eanCode not in (
      SELECT eanCode FROM inventaire_snapshot where idinventaire=11
      ) AND idinventaire=11 group by eanCode) as a;