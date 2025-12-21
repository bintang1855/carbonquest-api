-- Add CASCADE delete to User_Missions foreign keys
ALTER TABLE "User_Missions" DROP CONSTRAINT IF EXISTS "User_Missions_id_user_fkey";
ALTER TABLE "User_Missions" DROP CONSTRAINT IF EXISTS "User_Missions_id_mission_fkey";

ALTER TABLE "User_Missions" 
  ADD CONSTRAINT "User_Missions_id_user_fkey" 
  FOREIGN KEY ("id_user") REFERENCES "Users"("id_user") 
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "User_Missions" 
  ADD CONSTRAINT "User_Missions_id_mission_fkey" 
  FOREIGN KEY ("id_mission") REFERENCES "Missions"("id_mission") 
  ON DELETE CASCADE ON UPDATE CASCADE;
