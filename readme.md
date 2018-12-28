# stories

1. doctor comes to the welcome and creates himself as an agent
- doctor comes in with the x-role-key
- user is fetched  from the ed using x-role-key - find or create
- org is fetched based on the role - find or create
- agent is created 

2. a patient comes and takes an appointment of a doctor
- list of agents is fetched
- list of appointments is fetched for the agent
- check if no appointment exists at that time

- user is fetched  from the ed using x-role-key - find or create
- org is fetched from the agent's org
- visitor is created
- create an object of appointment

3. admin of hospital creates a dental OPD
- queue type is created

4. admin sets doctors that will be available on dental OPD on that day 
- queue is created and updated
- should be replaced with a cron job

5. a patient comes to show his teeth in dental OPD
- dental-opd is a queue for the given day
- next token no is fetched from the queue
- an appointment is created with queue and token no

6. the doctor sees the next patient
- agent sees next available appointment on the queue
- appointment is updated with the agent


