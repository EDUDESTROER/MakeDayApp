import { SETTINGS_SCHEMA } from "../schemas/settings.schema.js";
import { getUserSettings } from "../repositories/settings.repository.js";

export async function mergeSettings(userId){

    try{

      const userSettings = await getUserSettings(userId);

      const mergedSettings = buildUserSettings(SETTINGS_SCHEMA, userSettings);

      //console.log(mergedSettings);

      return mergedSettings;

    }catch(err){

        throw new Error(err);

    }

}
function buildUserSettings(schema, userSettings) {
  return schema.map(item => ({
    ...item,
    value: userSettings[item.key] ?? item.defaultValue
  }));
}