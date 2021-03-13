using System.Collections.Generic;
using Config;
using System.IO;
using UnityEngine;
using System;
public static partial class CfgMgr
{
	static CfgMgr()
	{
        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }

		TableNames.Add("equip");
		
        foreach (string name in TableNames)
        {
            Stream sm = null;
            if (File.Exists(path + name))
                sm = new FileStream(path + name, FileMode.Open);
            else
            {
                var ft = Resources.Load(cfgPath + name) as TextAsset;
                sm = new MemoryStream(ft.bytes);
            }
            Type t = Type.GetType("Config." + name);
            cacheTable(t, sm);
			sm.Close();
        }
    }
	static Dictionary<int, equip.Types.Record> equip_map = new Dictionary<int, equip.Types.Record>();
	public static equip.Types.Record GetRecordById(this equip obj, int id)
	{
		if (equip_map.Count != obj.Records.Count)
		{
			equip_map.Clear();
			foreach (equip.Types.Record r in obj.Records)
			{
				equip_map[r.Id] = r;
			}
		}
		if (equip_map.ContainsKey(id))
			return equip_map[id];
		return null;
	}
}