# How to develop and run cypress tests

## Run supabase instance
1) Start supabase
```
supabase start
```
When started you can find the url of the supabase website in the terminal (i.e. Studio URL: `127.0.0.1:54323`)

Replace the following keys in `frontend/.env` by the values displayed on the terminal:
- NEXT_PUBLIC_SUPABASE_URL (API URL)
- NEXT_PUBLIC_SUPABASE_ANON_KEY (anon key)
- SUPABASE_SERVICE_ROLE_KEY (service_role key)

2) Stop supabase
```
supabase stop
```
3) Reset supabase
```
supabase reset
```
4) Load phase from config yaml file
Config files for reference located in backend (i.e `backend/apl_config_gend_all_phases.yml`)
```
poetry run python backend/process_config.py --env_file ../frontend/.env --config <config_yaml_file>
```

5) Run the e2e tests
```
npx cypress run
```
To open the GUI:
```
npx cypress open
```

## Other interesting sources for development
- `supabase/migrations` contains sql commands to manipulate the supabase DB.
- `e2e/package.json` contains scripts to (i.e. reset the database, run e2e tests)


# e2e


reset db: ```supabase db reset```

load config: 
```
cd backend

poetry run python backend/process_config.py --config ../e2e/cypress/e2e/supabase/apl_config_e2e.yml --env_file ../frontend/.env
```