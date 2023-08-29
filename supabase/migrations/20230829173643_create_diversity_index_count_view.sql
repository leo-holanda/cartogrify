create view
  public.diversity_index_count as
select
  dps.countries_count,
  count(*) as occurrence_quantity
from
  diversity_per_user dps
group by
  dps.countries_count;