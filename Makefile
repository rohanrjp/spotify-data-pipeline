# Variables to keep things tidy
ENV_FILE := --env-file .env
DBT_PROJECT := --project-dir data-pipeline/spotify_transform
DBT_PROFILES := --profiles-dir data-pipeline/spotify_transform
DBT_CONTEXT := --project data-pipeline

# Ingest data from Spotify
ingest:
	export PYTHONPATH=$${PYTHONPATH}:$(shell pwd)/data-pipeline/ingestion && \
	uv run $(ENV_FILE) python data-pipeline/ingestion/main.py

# Run dbt transformations (Silver & Gold)
transform:
	uv run $(ENV_FILE) $(DBT_CONTEXT) dbt run $(DBT_PROJECT) $(DBT_PROFILES)

# Run a full refresh (if you change your SQL logic)
refresh:
	uv run $(ENV_FILE) $(DBT_CONTEXT) dbt run $(DBT_PROJECT) $(DBT_PROFILES) --full-refresh

# Run everything in order
pipeline: ingest transform