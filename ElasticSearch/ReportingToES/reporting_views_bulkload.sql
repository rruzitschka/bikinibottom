DROP FUNCTION IF EXISTS elastic_bulkload_views(month TEXT);

CREATE FUNCTION elastic_bulkload_views(month TEXT)
RETURNS TABLE (ndjson text)
AS $$
DECLARE
  row RECORD;
  tid BIGINT;
  lang TEXT;
BEGIN
  FOR row IN
    SELECT
      v.transaction_id as "viewGuid",
      v.session_id as "sessionId",
      replace(v.view_start::text, ' ', 'T') as "viewStart",
      replace(v.view_end::text, ' ', 'T') as "viewEnd",
      v.viewing_time_net as "viewingTimeNet",
      lower(v.geolocation) as "viewLocation",

      t.guid as "titleGuid",
      case when a.type = 'P' then 'Trailer' when a.type = 'F' then 'Feature' when a.type = 'TV' then 'TV' else a.type end as "assetType",
      v.series_name as "seriesName",
      v.season_name as "seasonName",
      v.title_name as "titleName",
      v.title_type as "titleType",
      string_to_array(v.genre, '/') as "genres",
      t.display_duration_sec as "duration",

      v.suid as "userGuid",
      'user'||u.user_id||case when u.nickname~'@' then '@'||split_part(u.nickname, '@', 2) else '' end as "userName", -- anonymized
      replace(u.account_activation_date::text, ' ', 'T') as "accountActivationDate",
      u.test_user_auth=1 as "testUser",
      case when u.parent_system_user_id='' then null else u.parent_system_user_id end as "parentUserGuid",
      case when ud.gender_male=1 then 'male' when ud.gender_male=0 then 'female' else null end as "gender",
      ud.date_of_birth::text as "dateOfBirth",
      u.region as "homeLocation",
      ud.city as "city",
      case when ud.country='Deutschland' then 'deu' when ud.country like '%sterreich' then 'aut' when ud.country='Schweiz' then 'che' else ud.country end as "country",

      case when v.delivery_type = 'STR' then 'Streaming' when v.delivery_type = 'CDL' then 'Download' when v.delivery_type = 'OFF' then 'Offline' else v.delivery_type end as "deliveryType",
      coalesce(n.device_custom_name, replace(lower(v.device_type), 'm_', '')) as "deviceType"
    FROM rs_viewdetails v
    JOIN bms_asset_instances a ON v.asset_id=a.guid
    JOIN bms_titles t ON a.title_id=t.cms_id
    JOIN sa_user u ON v.suid=u.system_user_id
    JOIN sa_user_data ud ON u.user_id=ud.user_id
    LEFT JOIN sa_device_name n ON n.device_name=lower(v.device_type)
    WHERE v.view_start>=(month||'-01')::timestamp with time zone
      AND v.view_start<(month||'-01')::timestamp with time zone+'1 month'::interval
  LOOP
    -- elastic search bulk load: set index name and document id
    ndjson:='{"index":{"_index":"views_'||replace(month, '-', '')||'","_type":"_doc","_id":"'||row."viewGuid"||'"}}';
    RETURN NEXT;

    -- remove nulls and ",}" occurences caused by removal of trailing null value elements
    ndjson:=regexp_replace(row_to_json(row)::text, '"[^"]+":null,?', '', 'g');
    ndjson:=replace(ndjson, ',}', '}');
    RETURN NEXT;
  END LOOP;
END;
$$ LANGUAGE plpgsql STABLE STRICT;

-- SELECT * FROM elastic_bulkload_views('2016-03');
