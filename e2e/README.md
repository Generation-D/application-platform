# How to develop and run cypress tests

## Run supabase instance
1) Start supabase
```
supabase start
```
When started you can find the url of the supabase website in the terminal (i.e. Studio URL: `127.0.0.1:54323`)

Replace the following keys in `frontend/.env` by the values displayed on the terminal (not necessary if already done):
- NEXT_PUBLIC_SUPABASE_URL (API URL)
- NEXT_PUBLIC_SUPABASE_ANON_KEY (anon key)
- SUPABASE_SERVICE_ROLE_KEY (service_role key)

Make sure that you use the local db credentials!

2) Reset supabase db
```
supabase db reset
```
3) Load phase from config yaml file
(Config files for reference i.e `backend/apl_config_gend_all_phases.yml`)
```
cd backend
poetry run python backend/process_config.py --config ../e2e/cypress/e2e/supabase/apl_config_e2e.yml --env_file ../frontend/.env
```
4) Install dependencies
```
cd ../e2e
npm install
```
5) Start the frontend in a new terminal
```
cd ../frontend
npm run dev
```
6) Run the e2e tests
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
