create table
  public.diversity_per_user (
    user_countries_count smallint not null,
    user_id text not null,
    user_country_code integer null,
    constraint diversity_per_user_pkey primary key (user_id),
    constraint diversity_per_country_quantity_user_id_key unique (user_id)
  ) tablespace pg_default;