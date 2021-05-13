package kr.co.itfact.scrm.batch.launcher;

import java.util.HashMap;
import java.util.List;
import org.quartz.SchedulerException;
import kr.co.itfact.scrm.dao.DefaultDAO;

public abstract class ABatchLauncher {
	private DefaultDAO daoHandler;
	
	public void setDaoHandler(DefaultDAO daoHandler) {
		this.daoHandler = daoHandler;
	}
	
	public HashMap<String, Object> getBatchInfo(String id) throws Exception {
		HashMap<String, Object> parameter = new HashMap<String, Object>();
		parameter.put("JOB_NM", id);
		List<HashMap<String, Object>> infos = daoHandler.serviceRead("BAT.R_getBatInfoFromJobNm", parameter);
		if (!(infos.get(0).get("USE_YN").toString()).equals("Y")) throw new SchedulerException("Unused Batch");
		return infos.get(0);
	}
}
