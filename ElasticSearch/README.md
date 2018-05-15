### Create ES bulk load file from BMS DB
Import `bms_elastic_bulkload.sql` to BMS DB, then run
```
$ psql -Atc "SELECT * FROM elastic_bulkload()" > bulk.json
```
**Note**: Postgres &ge;9.4 is required for JSON support.

### Define ES index mappings and bulkload data
(Re)create index mapping on Elastic Search instance (using kibana Dev Console):
```
$ DELETE http://es.instance.com/index
$ PUT http://es.instance.com/index
   payload: index_mapping.json or index_mapping_nested.json
```

Bulk load data from previously generated `bulk.json` file to the new index:

```
$ curl -s -H "Content-Type: application/x-ndjson" -XPOST "http://es.instance.com/index/_bulk?pretty" --data-binary "@bulk.json" | head
```

**Note**: split bulk.json to &lt;10MB chunks when POSTing to a t2.small.elasticsearch instance, but make sure every part contains an even number of lines.

### Elastic Search Query examples
```
# full text search
GET http://es.instance.com/index/_search?q=Metal&_source_include=originalName,mediaLangs.langId,mediaLangs.synopsis.*&pretty

# full text search on nested index mapping
GET http://es.instance.com/index/_search
{
  "query": {
    "constant_score": {
      "filter": {
        "bool": {
          "should": [
            { "simple_query_string": { "query": "Metal" } },
            { "nested": { "path": "mediaLangs", "query": { "simple_query_string": { "query": "Metal" } } } },
            { "nested": { "path": "mediaLangs.actors", "query": { "simple_query_string": { "query": "Metal" } } } },
            { "nested": { "path": "mediaLangs.crew", "query": { "simple_query_string": { "query": "Metal" } } } }
          ]
        }
      }
    }
  }
}
```
