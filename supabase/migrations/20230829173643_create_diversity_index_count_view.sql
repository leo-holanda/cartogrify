create view
  public.diversity_indexes as
select
  dps.user_country_code as country_code,
  dps.user_countries_count as countries_count,
  count(*) as occurrence_quantity
from
  diversity_per_user dps
group by
  dps.user_country_code,
  dps.user_countries_count;