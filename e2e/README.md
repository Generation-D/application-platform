# e2e


reset db: ```supabase db reset```

load config: 
```
cd backend

poetry run python backend/process_config.py --config ../e2e/cypress/e2e/supabase/apl_config_e2e.yml --env_file ../frontend/.env
```