```sh
# https://github.com/supabase/cli
./node_modules/.bin/supabase login
alias supabase=./node_modules/.bin/supabase
supabase init
# N
supabase link --project-ref hcbawdmupnlvqtyaubvt
# Enter your database password (or leave blank to skip):
# Finished supabase link.
supabase migration new new-migration
supabase db push
```