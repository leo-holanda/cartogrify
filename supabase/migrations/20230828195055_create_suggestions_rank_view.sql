create view
  public.suggestions_rank as
select
  suggestions_rank.artist_name,
  suggestions_rank.country_code,
  suggestions_rank.suggestion_rank
from
  (
    select
      suggestions_per_artist.artist_name,
      suggestions_per_artist.country_code,
      row_number() over (
        partition by
          suggestions_per_artist.artist_name
      ) as suggestion_rank
    from
      (
        select
          s.artist_name,
          s.country_code,
          count(*) as suggestion_count
        from
          suggestions s
        group by
          s.artist_name,
          s.country_code
      ) suggestions_per_artist
  ) suggestions_rank
where
  suggestions_rank.suggestion_rank = 1;