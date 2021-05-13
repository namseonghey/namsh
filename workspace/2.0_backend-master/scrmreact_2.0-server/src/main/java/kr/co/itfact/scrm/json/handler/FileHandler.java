package kr.co.itfact.scrm.json.handler;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import kr.co.itfact.scrm.json.dataset.ConfigDataSet;
import kr.co.itfact.scrm.json.vo.DefaultVO;

public class FileHandler {
	private final Logger logger = LoggerFactory.getLogger(FileHandler.class);
	
	public static final String RESULT = "result";
	public static final String MESSAGE = "message";
	public static final String RESPONSE = "reponse";
	public static final int SUCCESS_CODE = 0;
	public static final int ERROR_CODE = 1;

	public void dir(ConfigDataSet config, DefaultVO vo, int rowindex) throws Exception {
		@SuppressWarnings("unused")
		String jobName = config.getSqlID(rowindex);
		List<HashMap<String, Object>> lstData = vo.getReqDataSet(config.getDatasetsSend(rowindex));
		List<HashMap<String, Object>> lstResponse = new ArrayList<HashMap<String, Object>>();
		String outDataSetName = config.getDatasetsRecv(rowindex);
		
		HashMap<String, Object> param = lstData.get(0);
		lstResponse = this.dir(param);
		
		vo.getResDatasets().put(outDataSetName, lstResponse);
	}
	
	public List<HashMap<String, Object>> dir(HashMap<String, Object> param) {
		List<HashMap<String, Object>> result = new ArrayList<HashMap<String, Object>>();
		File dir = new File(param.get("FILE_PATH").toString());
		File[] files = dir.listFiles();
		HashMap<String, Object> record = null;
		for (int intA=0; intA<files.length; intA++) {
			record = new HashMap<String, Object>();
			record.put("recid", intA);
			record.put("state", "r");
			record.put("ABSOLUTE_PATH", files[intA].getAbsolutePath().replaceAll("\\\\", "/"));
			try {
				record.put("CANONICAL_PATH", files[intA].getCanonicalPath().replaceAll("\\\\", "/"));
			} catch (IOException e) {
				record.put("CANONICAL_PATH", files[intA].getAbsolutePath().replaceAll("\\\\", "/"));
			}
			record.put("FREE_SPACE", files[intA].getFreeSpace());
			record.put("NAME", files[intA].getName());
			record.put("PATENT", files[intA].getParent().replaceAll("\\\\", "/"));
			record.put("PATH", files[intA].getPath().replaceAll("\\\\", "/"));
			record.put("TOTAL_SPACE", files[intA].getTotalSpace());
			record.put("USABLE_SPACE", files[intA].getUsableSpace());
			record.put("IS_ABSOLUTE", files[intA].isAbsolute());
			record.put("IS_DIRECTORY", files[intA].isDirectory());
			record.put("IS_FILE", files[intA].isFile());
			record.put("IS_HIDDEN", files[intA].isHidden());
			record.put("LAST_MODIFIED", new SimpleDateFormat("yyyyMMddHHmmss").format(new Date(files[intA].lastModified())));
			record.put("LENGTH", files[intA].length());
			
			result.add(record);
			record = null;
		}
		
		return result;
	}
}
