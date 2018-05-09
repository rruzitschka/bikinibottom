/*

Postgres function to extract BMS mediaAsset info into ElasticSearch bulk load file
Version 0.2
Author: MK

Install/update in BMS DB, then run following query:

SELECT * FROM elastic_bulkload();

*/
 

DROP FUNCTION IF EXISTS elastic_bulkload();

CREATE FUNCTION elastic_bulkload()
RETURNS TABLE (mediaasset text)
AS $$
DECLARE
  row RECORD;
  tid BIGINT;
  lang TEXT;
BEGIN
  -- iterate over titles
  FOR row IN
    WITH parent_child AS (
      SELECT series_id AS parent, season_id AS child, position FROM series_titles
      UNION SELECT season_id, episode_id, position FROM season_titles
    )
    SELECT titles.cms_id,
    titles.guid as "asset_id",
    seo_ids.value as "seoID",
    title_types.name as "assetType",
    title_sub_types.name as "assetSubType",
    titles.original_name as "originalName",
    languages.language_code as "originalLanguage",
    titles.display_duration_sec as "duration",
    (SELECT json_agg(uri_id ORDER BY uri_id) FROM title_genres JOIN genres ON title_genres.genre_id=genres.cms_id WHERE title_genres.title_id=titles.cms_id AND uri_id IS NOT null) as "genres",
    (SELECT json_agg(value ORDER BY value) FROM title_keywords WHERE title_keywords.title_id=titles.cms_id) as "keywords",
    (SELECT json_agg(guid ORDER BY position) FROM parent_child JOIN titles t2 ON parent_child.child=t2.cms_id WHERE parent_child.parent=titles.cms_id AND NOT t2.deleted) as "childTitles",
    (SELECT guid FROM parent_child JOIN titles t2 ON parent_child.parent=t2.cms_id WHERE parent_child.child=titles.cms_id AND NOT t2.deleted) as "parentTitle",
    titles.publish as "publishFlag",
    title_catalogs.license_window_start as "validFrom",
    title_catalogs.license_window_end as "validTo",
    titles.production_year as "productionYear",
    titles.to_year as "productionYearTo"
    FROM titles
    JOIN title_types ON titles.title_type_id=title_types.cms_id
    LEFT JOIN title_sub_types ON titles.title_sub_type_id=title_sub_types.cms_id
    LEFT JOIN seo_ids ON titles.cms_id=seo_ids.title_id AND seo_ids.locale='en'
    LEFT JOIN title_original_languages ON titles.cms_id=title_original_languages.title_id
    LEFT JOIN languages ON title_original_languages.original_language_id=languages.cms_id
    LEFT JOIN title_catalogs ON title_catalogs.title_id=titles.cms_id
    WHERE NOT titles.deleted
  LOOP
    -- elastic search bulk load: set document id
    mediaasset:='{"index":{"_type":"_doc","_id":"'||row.asset_id||'"}}';
    RETURN NEXT;
 
    -- convert to json object without cms_id and null values
    tid=row.cms_id;
    mediaasset:=regexp_replace(row_to_json(row)::text, '"cms_id":\d+,|"[^"]+":null,?', '', 'g');

    -- start "mediaLangs" array
    mediaasset:=replace(mediaasset, '}', '"mediaLangs":[');

    -- iterate over all languages
    FOR lang IN
      SELECT DISTINCT locale
      FROM title_name_translatable_strings t
      JOIN translatable_strings s ON t.translatable_string_id=s.cms_id
      WHERE t.title_id=tid
      ORDER BY locale
    LOOP
      -- add ',' before next mediaLang object
      IF RIGHT(mediaasset, 1)='}' THEN mediaasset:=mediaasset||','; END IF;
      
      -- name and synopsis
      mediaasset:=mediaasset||regexp_replace(json_build_object(
        'langId', lang,
        'name', (SELECT trans_string FROM translatable_strings s JOIN title_name_translatable_strings t ON t.translatable_string_id=s.cms_id WHERE t.title_id=tid AND locale=lang),
        'shortName', (SELECT trans_string FROM translatable_strings s JOIN title_name_short_translatable_strings t ON t.translatable_string_id=s.cms_id WHERE t.title_id=tid AND locale=lang),
        'synopsis', json_build_object(
          'short', (SELECT trans_string FROM translatable_strings s JOIN title_synopsis_short_translatable_strings t ON t.translatable_string_id=s.cms_id WHERE t.title_id=tid AND locale=lang),
          'medium', (SELECT trans_string FROM translatable_strings s JOIN title_synopsis_medium_translatable_strings t ON t.translatable_string_id=s.cms_id WHERE t.title_id=tid AND locale=lang),
          'long', (SELECT trans_string FROM translatable_strings s JOIN title_synopsis_large_translatable_strings t ON t.translatable_string_id=s.cms_id WHERE t.title_id=tid AND locale=lang)
        )
      )::text, '"[^"]+" : null(, )?|}$', '', 'g');

      -- actors
      mediaasset:=mediaasset||',"actors":[';
      FOR row IN
        SELECT persons.guid as "personId",
          tname.trans_string as "name",
          trole.trans_string as "role",
          tdesc.trans_string as "description",
          (SELECT json_agg(guid) FROM (SELECT titles.guid FROM title_person_roles t2 JOIN titles ON t2.title_id=titles.cms_id WHERE t2.person_id=title_person_roles.person_id AND t2.title_id<>tid AND NOT t2.deleted and NOT titles.deleted LIMIT 5) t) as "relatedAssets"
        FROM title_person_roles
          JOIN persons ON title_person_roles.person_id=persons.cms_id
          JOIN person_name_translatable_strings ON title_person_roles.person_id=person_name_translatable_strings.person_id
          JOIN translatable_strings tname ON person_name_translatable_strings.translatable_string_id=tname.cms_id AND tname.locale=lang
          JOIN person_role_name_translatable_strings ON title_person_roles.person_role_id=person_role_name_translatable_strings.person_role_id
          JOIN translatable_strings trole ON person_role_name_translatable_strings.translatable_string_id=trole.cms_id AND trole.locale=lang
          LEFT JOIN person_description_translatable_strings ON title_person_roles.person_role_id=person_description_translatable_strings.person_id
          LEFT JOIN translatable_strings tdesc ON person_description_translatable_strings.translatable_string_id=tdesc.cms_id AND tdesc.locale=lang
        WHERE title_id=tid AND leading_cast AND NOT title_person_roles.deleted
        ORDER BY title_person_roles.order_number
      LOOP
        IF RIGHT(mediaasset, 1)='}' THEN mediaasset:=mediaasset||','; END IF;
        mediaasset:=mediaasset||regexp_replace(row_to_json(row)::text, '"[^"]+":null,?', '', 'g');
      END LOOP;

      -- crew
      mediaasset:=mediaasset||'],"crew":[';
      FOR row IN
        SELECT persons.guid as "personId",
          tname.trans_string as "name",
          trole.trans_string as "role",
          tdesc.trans_string as "description",
          (SELECT json_agg(guid) FROM (SELECT titles.guid FROM title_person_roles t2 JOIN titles ON t2.title_id=titles.cms_id WHERE t2.person_id=title_person_roles.person_id AND t2.title_id<>tid AND NOT t2.deleted and NOT titles.deleted LIMIT 5) t) as "relatedAssets"
        FROM title_person_roles
          JOIN persons ON title_person_roles.person_id=persons.cms_id
          JOIN person_name_translatable_strings ON title_person_roles.person_id=person_name_translatable_strings.person_id
          JOIN translatable_strings tname ON person_name_translatable_strings.translatable_string_id=tname.cms_id AND tname.locale=lang
          JOIN person_role_name_translatable_strings ON title_person_roles.person_role_id=person_role_name_translatable_strings.person_role_id
          JOIN translatable_strings trole ON person_role_name_translatable_strings.translatable_string_id=trole.cms_id AND trole.locale=lang
          LEFT JOIN person_description_translatable_strings ON title_person_roles.person_role_id=person_description_translatable_strings.person_id
          LEFT JOIN translatable_strings tdesc ON person_description_translatable_strings.translatable_string_id=tdesc.cms_id AND tdesc.locale=lang
        WHERE title_id=tid AND NOT leading_cast AND NOT title_person_roles.deleted
        ORDER BY title_person_roles.order_number
      LOOP
        IF RIGHT(mediaasset, 1)='}' THEN mediaasset:=mediaasset||','; END IF;
        mediaasset:=mediaasset||regexp_replace(row_to_json(row)::text, '"[^"]+":null,?', '', 'g');
      END LOOP;

      -- close crew and mediaLang
      mediaasset:=mediaasset||']}';
    END LOOP;

    -- close mediaLangs and mediaAsset
    mediaasset:=mediaasset||']}';

    -- remove ",}" occurences caused by removal of trailing null value elements
    mediaasset:=replace(mediaasset, ',}', '}');
    RETURN NEXT;
  END LOOP;
END;
$$ LANGUAGE plpgsql; 
