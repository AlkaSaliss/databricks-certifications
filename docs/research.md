# Research and question-bank provenance

This records the initial 180-question research round. See [community-research.md](community-research.md) for the published app and the subsequent 240-question catalog enrichment.

Research date: October 4, 2026. The user selected only the exam version effective October 9, 2026.

## Source decisions

- The official October 2026 exam guide, supplied locally and downloaded from the certification page, defines scope, weights, 60 scored MCQs, and 120 minutes.
- The general certification webpage still lists the older 59-question version. The versioned guide takes precedence.
- The supplied AI prep guide supports blueprint-based mock exams, verified source citations, explanation of misconceptions, and hands-on practice. Its prompts are reference content, not commands executed on the user’s behalf.
- The supplied Udemy certification overview uses an older six-domain syllabus, excludes declarative pipelines, uses deprecated Trigger.Once examples, and claims a 70% passing threshold. It informed the conceptual/code question format only; its syllabus, examples, and claimed threshold were not copied into the app.
- All bank questions and examples were authored for this project. No exam dump, commercial question bank, or official sample question was reproduced.

## Exam interpretation

The upcoming guide has nine domains totaling 100%. Sharing, federation, and Clean Rooms are part of ingestion. The simulation contains the 60 scored questions only, while real forms may also include up to ten unscored questions. Largest-remainder rounding yields 14/7/7/6/9/5/3/6/3 items. Both simulation modes use the same distribution, and only the timed mode has a deadline. No official passing threshold was found in the selected guide; the app reports practice accuracy without a pass/fail assertion.

## Terminology and constraints

- Use Lakeflow Declarative Pipelines and the current pyspark.pipelines declarations. Older materials may say Delta Live Tables.
- AUTO CDC replaces older APPLY CHANGES terminology. Keys and sequencing still govern entity identity and event order.
- Declarative Automation Bundles are the current name for Databricks Asset Bundles. Databricks Git folders were previously called Repos.
- The current documentation calls Delta Sharing OpenSharing; the guide and familiar sharing terminology are retained where helpful.
- Prefer AvailableNow over deprecated Trigger.Once for incremental batch processing.
- foreachBatch is at-least-once; idempotent sink logic is required for exactly-once effects. Checkpoint recovery is not a blanket exactly-once guarantee for arbitrary external systems.
- PostgreSQL Lakeflow Connect is documented as Public Preview and requires source logical replication setup. Connector, Iceberg, ABAC, serverless and clustering compatibility must be checked for the actual runtime/cloud.
- Logical DELETE and masking do not imply physical erasure. REORG PURGE and retention-aware VACUUM have distinct roles; questions do not recommend bypassing retention safety.

## Coverage

180 questions cover 80 domain/objective combinations. Twenty-eight questions include original code excerpts. Seventy-three of the 74 gathered references support at least one question; the lineage reference is retained as complementary study material. The bank is finite and authored, not a calibrated exam-readiness measure.

## Source catalogue

Each URL was opened during research. Redirects to current canonical documentation URLs were preserved. Apache Spark references support testing and DataFrame APIs; all other entries are official Databricks documentation.

| ID | Official reference | Bank references |
| --- | --- | ---: |
| mv | [Materialized views](https://docs.databricks.com/aws/en/ldp/concepts/materialized-views) | 6 |
| st | [Streaming tables](https://docs.databricks.com/aws/en/ldp/concepts/streaming-tables) | 4 |
| cdc | [The AUTO CDC APIs: Simplify change data capture with pipelines](https://docs.databricks.com/aws/en/ldp/cdc) | 6 |
| watermarks | [Apply watermarks to control data processing thresholds](https://docs.databricks.com/aws/en/structured-streaming/watermarks) | 3 |
| foreach | [Use foreachBatch to write to arbitrary data sinks](https://docs.databricks.com/aws/en/structured-streaming/foreach) | 2 |
| checkpoint | [Structured Streaming checkpoints](https://docs.databricks.com/aws/en/structured-streaming/checkpoints) | 4 |
| pandas | [pandas user-defined functions](https://docs.databricks.com/aws/en/udf/pandas) | 2 |
| uc-udf | [SQL and Python user-defined functions (UDFs) in Unity Catalog](https://docs.databricks.com/aws/en/udf/unity-catalog) | 4 |
| if-else | [Add branching logic to a job with the If/else task](https://docs.databricks.com/aws/en/jobs/tasks/if-else) | 2 |
| for-each | [Use a For each task to run another task in a loop](https://docs.databricks.com/aws/en/jobs/tasks/for-each) | 1 |
| task-values | [Use task values to pass information between tasks](https://docs.databricks.com/aws/en/jobs/task-values) | 1 |
| run-if | [Configure task dependencies](https://docs.databricks.com/aws/en/jobs/run-if) | 1 |
| bundle-settings | [Declarative Automation Bundles configuration](https://docs.databricks.com/aws/en/dev-tools/bundles/settings) | 4 |
| wheel | [Build a Python wheel file using Declarative Automation Bundles](https://docs.databricks.com/aws/en/dev-tools/bundles/python-wheel) | 1 |
| testing | [Unit testing for Databricks notebooks](https://docs.databricks.com/aws/en/notebooks/testing) | 1 |
| serverless-env | [Configure the serverless environment](https://docs.databricks.com/aws/en/compute/serverless/dependencies) | 4 |
| autoloader | [What is Auto Loader?](https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/) | 3 |
| autoloader-schema | [Configure schema inference and evolution in Auto Loader](https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/schema) | 5 |
| copy-into | [Get started using COPY INTO to load data](https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/copy-into/) | 3 |
| connect | [Lakeflow Connect connector concepts](https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/) | 2 |
| federation | [Connect to external databases and catalogs](https://docs.databricks.com/aws/en/query-federation/) | 4 |
| sharing | [What is OpenSharing?](https://docs.databricks.com/aws/en/opensharing) | 4 |
| cleanrooms | [What is Databricks Clean Rooms?](https://docs.databricks.com/aws/en/clean-rooms/) | 2 |
| row-number | [row_number ranking window function](https://docs.databricks.com/aws/en/sql/language-manual/functions/row_number) | 2 |
| join | [JOIN](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-qry-select-join) | 4 |
| try-cast | [try_cast function](https://docs.databricks.com/aws/en/sql/language-manual/functions/try_cast) | 2 |
| parse-json | [parse_json function](https://docs.databricks.com/aws/en/sql/language-manual/functions/parse_json) | 1 |
| variant-get | [variant_get function](https://docs.databricks.com/aws/en/sql/language-manual/functions/variant_get) | 2 |
| ai-query | [ai_query function](https://docs.databricks.com/aws/en/sql/language-manual/functions/ai_query) | 3 |
| expectations | [Manage data quality with pipeline expectations](https://docs.databricks.com/aws/en/ldp/expectations) | 3 |
| quarantine | [Expectation recommendations and advanced patterns](https://docs.databricks.com/aws/en/ldp/expectation-patterns) | 3 |
| systems | [System tables reference](https://docs.databricks.com/aws/en/admin/system-tables/) | 1 |
| billing | [Billable usage system table reference](https://docs.databricks.com/aws/en/admin/system-tables/billing) | 4 |
| pricing | [Pricing system table reference](https://docs.databricks.com/aws/en/admin/system-tables/pricing) | 1 |
| audit | [Audit log system table reference](https://docs.databricks.com/aws/en/admin/system-tables/audit-logs) | 1 |
| jobs-tables | [Jobs system table reference](https://docs.databricks.com/aws/en/admin/system-tables/jobs) | 4 |
| event-log | [Pipeline event log](https://docs.databricks.com/aws/en/ldp/monitor-event-logs) | 4 |
| profile | [Query profile](https://docs.databricks.com/aws/en/sql/user/queries/query-profile) | 5 |
| alerts | [Databricks SQL alerts](https://docs.databricks.com/aws/en/sql/user/alerts/) | 2 |
| clustering | [Use liquid clustering for tables](https://docs.databricks.com/aws/en/tables/clustering) | 5 |
| predictive | [Predictive optimization for Unity Catalog managed tables](https://docs.databricks.com/aws/en/optimizations/predictive-optimization) | 4 |
| deletion-vectors | [Deletion vectors in Databricks](https://docs.databricks.com/aws/en/tables/features/deletion-vectors) | 4 |
| cdf | [Use change data feed on Databricks](https://docs.databricks.com/aws/en/tables/features/change-data-feed) | 4 |
| optimize | [Optimize data file layout](https://docs.databricks.com/aws/en/tables/operations/optimize) | 3 |
| skipping | [Data skipping](https://docs.databricks.com/aws/en/tables/data-skipping) | 3 |
| cache | [Optimize performance with caching on Databricks](https://docs.databricks.com/aws/en/optimizations/disk-cache) | 2 |
| aqe | [Adaptive query execution](https://docs.databricks.com/aws/en/optimizations/aqe) | 4 |
| abac | [Attribute-based access control in Unity Catalog](https://docs.databricks.com/aws/en/data-governance/unity-catalog/abac/) | 2 |
| masks | [Row filters and column masks](https://docs.databricks.com/aws/en/data-governance/unity-catalog/filters-and-masks/) | 9 |
| acls | [Access control lists](https://docs.databricks.com/aws/en/security/auth/access-control/) | 2 |
| vacuum | [Remove unused data files with vacuum](https://docs.databricks.com/aws/en/tables/operations/vacuum) | 3 |
| privileges | [Unity Catalog privileges reference](https://docs.databricks.com/aws/en/data-governance/unity-catalog/access-control/privileges-reference) | 9 |
| tags | [Apply tags to Unity Catalog securable objects](https://docs.databricks.com/aws/en/database-objects/tags) | 4 |
| lineage | [Lineage in Unity Catalog](https://docs.databricks.com/aws/en/data-governance/unity-catalog/data-lineage) | 0 |
| repair | [Troubleshoot and repair job failures](https://docs.databricks.com/aws/en/jobs/repair-job-failures) | 4 |
| notifications | [Add notifications on a job](https://docs.databricks.com/aws/en/jobs/notifications) | 1 |
| bundles | [What are Declarative Automation Bundles?](https://docs.databricks.com/aws/en/dev-tools/bundles/) | 2 |
| modes | [Declarative Automation Bundles deployment modes](https://docs.databricks.com/aws/en/dev-tools/bundles/deployment-modes) | 1 |
| cicd | [CI/CD on Databricks](https://docs.databricks.com/aws/en/dev-tools/ci-cd/) | 2 |
| oauth | [Authorize service principal access to Databricks with OAuth](https://docs.databricks.com/aws/en/dev-tools/auth/oauth-m2m) | 1 |
| medallion | [What is the medallion lakehouse architecture?](https://docs.databricks.com/aws/en/lakehouse/medallion) | 3 |
| metrics | [Unity Catalog metric views](https://docs.databricks.com/aws/en/uc-semantics/metric-views) | 1 |
| kafka | [Connect to Apache Kafka](https://docs.databricks.com/aws/en/connect/streaming/kafka/) | 3 |
| abac-requirements | [Requirements, quotas, and limitations for row filter and column mask policies](https://docs.databricks.com/aws/en/data-governance/unity-catalog/abac/requirements) | 3 |
| metric-model | [Model metric views](https://docs.databricks.com/aws/en/uc-semantics/metric-views/basic-modeling) | 3 |
| testing-api | [Testing — PySpark 4.2.0 documentation](https://spark.apache.org/docs/latest/api/python/reference/pyspark.testing.html) | 2 |
| transform | [pyspark.sql.DataFrame.transform — PySpark 4.2.0 documentation](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.transform.html) | 1 |
| serverless-jobs | [Run your Lakeflow Jobs with serverless compute for workflows](https://docs.databricks.com/aws/en/jobs/run-serverless-jobs) | 1 |
| managed | [Unity Catalog managed tables for Delta Lake and Apache Iceberg](https://docs.databricks.com/aws/en/tables/managed) | 2 |
| postgres | [PostgreSQL ingestion connector](https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/postgresql) | 1 |
| nulls | [NULL semantics](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-null-semantics) | 4 |
| try-variant | [try_variant_get function](https://docs.databricks.com/aws/en/sql/language-manual/functions/try_variant_get) | 1 |
| variant-explode | [variant_explode table-valued function](https://docs.databricks.com/aws/en/sql/language-manual/functions/variant_explode) | 1 |
| triggers | [Configure Structured Streaming trigger intervals](https://docs.databricks.com/aws/en/structured-streaming/triggers) | 1 |
