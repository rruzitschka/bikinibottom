### Create ES bulk load file from Reporting DB
Import `reporting_views_bulkload.sql` to Reporting DB, then repeatedly run following function for every month:
```
$ psql -Atc "SELECT * FROM elastic_bulkload_views('2016-03');" > views_201603.json
```
**Note**: Postgres &ge;9.4 is required for JSON support.

### Define ES template to automatically index future indexes matching "views_*"
Create index mapping on Elastic Search instance (using kibana Dev Console):
```
PUT _template/views
{
  "index_patterns": ["views_*"],
  "mappings": {
    "_doc": {
      "dynamic_templates": [
        {
          "text_default_keyword": {
            "match_mapping_type": "string",
            "mapping": {
              "type": "keyword"
            }
          }
        }
      ],
      "properties": {
        "seriesName": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        },
        "seasonName": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        },
        "titleName": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        }
      }
    }
  }
}
```

### Post data to ES
Split bulk load json files to ~10 MB chunks and post them to ES.
**Note** that the json file already includes the index name (e.g. `views_201603`), thus it needs to be posted to /_bulk directly.

```
# split into ~10 MB junks
split -l 20000 views_201603.json

# post each of those junks to ES
for i in x??; do echo $i; curl -s -H "Content-Type: application/x-ndjson" -XPOST "http://es.instance.com/_bulk?pretty" --data-binary "@$i" > $i_result.json; done
```