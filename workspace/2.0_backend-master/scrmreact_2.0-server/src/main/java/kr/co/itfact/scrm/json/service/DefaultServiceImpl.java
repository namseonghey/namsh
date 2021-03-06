package kr.co.itfact.scrm.json.service;

import java.io.IOException;
import java.net.UnknownHostException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.HashMap;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import kr.co.itfact.scrm.batch.handler.SpringBatchHandler;
import kr.co.itfact.scrm.dao.DefaultDAO;
import kr.co.itfact.scrm.json.dataset.ConfigDataSet;
import kr.co.itfact.scrm.json.handler.FileHandler;
import kr.co.itfact.scrm.json.handler.InterfaceHandler;
import kr.co.itfact.scrm.json.handler.URLHandler;
import kr.co.itfact.scrm.json.vo.DefaultVO;
import kr.co.itfact.util.MessageDigestUtils;

@Service
public class DefaultServiceImpl implements DefaultService {
	private final Logger logger = LoggerFactory.getLogger(DefaultServiceImpl.class);
	
	@Autowired
	@Qualifier("primaryDAO")
	private DefaultDAO daoPrimary;
	
	@Autowired
	@Qualifier("secondaryDAO")
	private DefaultDAO daoSecondary;
	
	@Autowired
	private ApplicationContext	applicationContext;
	
	@Autowired
	private Environment env;

	@Autowired
	private JobLauncher jobLauncher;
	
	private DefaultDAO getDaoHandler(int idx) {
		DefaultDAO dao = null;
		switch (idx) {
		case ConfigDataSet.DAO_PRIMARY:		dao	= daoPrimary;	break;
		case ConfigDataSet.DAO_SECONDARY:	dao	= daoSecondary;	break;
		}
		
		return dao;
	}
	
	public void service(DefaultVO vo) throws Exception {
		ConfigDataSet config = vo.getConfig();
		int crudh = -1;
		
		// make sequence or encryption password
		int[] befores = config.getBeforeList();
		for (int intA = 0; intA < befores.length; intA++) {
			crudh = config.getTransDv(befores[intA]);
			switch (crudh) {
			case ConfigDataSet.TRANS_DV_SEQUENCE:
				this.serviceSequence(config, vo, befores[intA]);
				break;
			case ConfigDataSet.TRANS_DV_PASSWD:
				this.servicePassword(config, vo, befores[intA]);
				break;
			}
		}
		
		// transaction
		int[] arrTransRows	= config.getTransactionList();
		for (int intA = 0; intA < arrTransRows.length; intA++) {
			crudh = config.getTransDv(arrTransRows[intA]);
			switch (crudh) {
			case ConfigDataSet.TRANS_DV_HANDLE:
				this.serviceHandle(this.getDaoHandler(config.getDaoDv(arrTransRows[intA])), config, vo, arrTransRows[intA]);
				break;
			case ConfigDataSet.TRANS_DV_BATCH:
				this.serviceBatch(this.getDaoHandler(config.getDaoDv(arrTransRows[intA])), config, vo, arrTransRows[intA]);
				break;
			case ConfigDataSet.TRANS_DV_DIR:
				this.serviceDir(this.getDaoHandler(config.getDaoDv(arrTransRows[intA])), config, vo, arrTransRows[intA]);
				break;
			case ConfigDataSet.TRANS_DV_INTERFACE:
				this.serviceInterface(this.getDaoHandler(config.getDaoDv(arrTransRows[intA])), config, vo, arrTransRows[intA]);
				break;
			default	:
				this.serviceDefault(this.getDaoHandler(config.getDaoDv(arrTransRows[intA])), config, vo, arrTransRows[intA]);
				break;
			}
		}
	}

	public void serviceHandle(DefaultDAO handler, ConfigDataSet config, DefaultVO vo, int rowindex) throws Exception {
		String statementName = config.getSqlID(rowindex);
		List<HashMap<String, Object>> lstData = vo.getReqDataSet(config.getDatasetsSend(rowindex));
		HashMap<String, Object> translog = config.getTransLog(rowindex);
		
		statementName = statementName.replace(ConfigDataSet.PREFIX_CREATE, ConfigDataSet.PREFIX_HANDLE);
		statementName = statementName.replace(ConfigDataSet.PREFIX_READ, ConfigDataSet.PREFIX_HANDLE);
		statementName = statementName.replace(ConfigDataSet.PREFIX_UPDATE, ConfigDataSet.PREFIX_HANDLE);
		statementName = statementName.replace(ConfigDataSet.PREFIX_DESTROY, ConfigDataSet.PREFIX_HANDLE);
		
		// destroy or create or update
		HashMap<String, Object> rowdata	= null;
		for(int intA = 0; intA < lstData.size(); intA++) {
			rowdata = vo.getRowData(ConfigDataSet.TRANS_DV_HANDLE, config.getDatasetsSend(rowindex), intA);
			
			// destroy
			if (rowdata.get("rowtype") != null && rowdata.get("rowtype").equals(ConfigDataSet.ROWTYPE_DESTROY)) {
				this.serviceDestroy(handler, statementName.replace(ConfigDataSet.PREFIX_HANDLE, ConfigDataSet.PREFIX_DESTROY), rowdata);
			}
			
			// create
			if (rowdata.get("rowtype") != null && rowdata.get("rowtype").equals(ConfigDataSet.ROWTYPE_CREATE)) {
				this.serviceCreate(handler, statementName.replace(ConfigDataSet.PREFIX_HANDLE, ConfigDataSet.PREFIX_CREATE), rowdata);
			}
			
			// update
			if (rowdata.get("rowtype") != null && (rowdata.get("rowtype").equals(ConfigDataSet.ROWTYPE_UPDATE))) {//|| rowdata.get("rowtype").equals(ConfigDataSet.ROWTYPE_READ) )) {
				this.serviceUpdate(handler, statementName.replace(ConfigDataSet.PREFIX_HANDLE, ConfigDataSet.PREFIX_UPDATE), rowdata);
			}
		}
	}
	
	/**
	 * <i>batch service</i>
	 * @param handler : DAO (Data Access object)
	 * @param config : received from the client configuration
	 * @param vo : DefaultVO
	 * @param rowindex : to handle configuration row index
	 * @throws Exception
	 */
	public void serviceBatch(DefaultDAO handler, ConfigDataSet config, DefaultVO vo, int rowindex) throws Exception {
		String jobName = config.getSqlID(rowindex);
		List<HashMap<String, Object>> lstData = vo.getReqDataSet(config.getDatasetsSend(rowindex));
		String outDataSetName = config.getDatasetsRecv(rowindex);
		SpringBatchHandler batch = new SpringBatchHandler(this.jobLauncher);
		vo.getResDatasets().put(outDataSetName, batch.handle(jobName, lstData.get(0)));
	}
	
	/**
	 * <i>batch service (transmission first server)</i>
	 * @param jobName batch id
	 * @param param
	 * @return result of batch process
	 */
	public List<HashMap<String, Object>> serviceBatch(String jobName, HashMap<String, Object> param) {
//		SpringBatchHandler batch = new SpringBatchHandler(this.jobLauncher);
//		return batch.handle(jobName, param);
		
		return null;
	}
	
	/**
	 * <i>sequence service</i>
	 * @param handler : DAO (Data Access object)
	 * @param config : received from the client configuration
	 * @param vo : DefaultVO
	 * @throws Exception
	 */
	public void serviceSequence(ConfigDataSet config, DefaultVO vo) throws Exception {
		int[] arrSeqRows = config.getSequenceList();
		for (int intA = 0; intA < arrSeqRows.length; intA++) {
			this.serviceSequence(config, vo, arrSeqRows[intA]);
		} 
	}
	
	/**
	 * <i>sequence service</i>
	 * @param handler : DAO (Data Access object)
	 * @param config : received from the client configuration
	 * @param vo : DefaultVO
	 * @param rowindex : to handle configuration row index
	 * @throws Exception
	 */
	public void serviceSequence(ConfigDataSet config, DefaultVO vo, int rowindex) throws Exception {
		String strSequence = null;
		String arrColumns[] = null;
		String arrDatasets[] = null;
		HashMap<String, Object> parameterMap = null;
		
		arrDatasets = config.getDatasetsMappList(rowindex);
		arrColumns = config.getStringToArray(config.getColumnID(rowindex));
		parameterMap = vo.getRowData(ConfigDataSet.TRANS_DV_SEQUENCE, config.getDatasetsSend(rowindex), 0);
		
		strSequence = this.serviceReadString(this.getDaoHandler(config.getDaoDv(rowindex)), config.getSqlID(rowindex), parameterMap);
		
		for (int intB = 0; intB < arrDatasets.length; intB++) {
			vo.setSequence(arrDatasets[intB], arrColumns, strSequence);
		}
	}
	
	/**
	 * <i>password encryption service</i><br>
	 *    ex : SOURCE column => SOURCE column + ENC_SOURCE column
	 * @param config : received from the client configuration
	 * @param vo : DefaultVO
	 * @throws Exception
	 */
	public void servicePassword(ConfigDataSet config, DefaultVO vo) throws Exception {
		int[] passwords	= config.getPasswordList();
		for (int intA = 0; intA < passwords.length; intA++) {
			this.servicePassword(config, vo, passwords[intA]);
		} 
	}
	
	/**
	 * <i>password encryption service</i><br>
	 *    ex : SOURCE column => SOURCE column + ENC_SOURCE column
	 * @param config : received from the client configuration
	 * @param vo : DefaultVO
	 * @param rowindex : to handle configuration row index
	 * @throws Exception
	 */
	public void servicePassword(ConfigDataSet config, DefaultVO vo, int rowindex) throws Exception {
		String name = null;
		String[] columns = null;
		List<HashMap<String, Object>> records = null;
		HashMap<String, Object> record = null;
		StringBuffer column = new StringBuffer();
		
		name = config.getDatasetsSend(rowindex);
		columns = config.getStringToArray( config.getColumnID(rowindex) );
		records = vo.getReqDataSet( name );
		
		for (int intB = 0; intB < columns.length; intB++) {
			for (int intC = 0; intC < records.size(); intC++) {
				column.delete(0, column.length());
				column.append(columns[intB]);
				
				record = vo.getRowData(ConfigDataSet.TRANS_DV_PASSWD, name, intC);
				record.put( column.toString(), MessageDigestUtils.digest( record.get( columns[intB] ).toString() ) );
			}
		}
	}
	
	public void serviceUpload(List<MultipartFile> files) throws Exception {
		Path path = Paths.get(env.getProperty("server.temp.upload.path"));
		
		if (Files.notExists(path)) Files.createDirectories(path);
		
		for (int idx = 0; idx < files.size(); idx++) {
			MultipartFile file = files.get(idx);
			if (file.isEmpty()) continue;
			
			Path fullPath = Paths.get(env.getProperty("server.temp.upload.path") + "/" + file.getOriginalFilename());
			if (Files.exists(fullPath)) continue;
			
			Files.write(fullPath, file.getBytes(), StandardOpenOption.CREATE);
		}
	}
	
	public void serviceInterface(DefaultDAO handler, ConfigDataSet config, DefaultVO vo, int rowindex) throws Exception {
		InterfaceHandler ifsHandler = new URLHandler(handler, config, vo, rowindex);
	}
	
	public List<HashMap<String, Object>> serviceRead(DefaultDAO handler, String statementName, HashMap<String, Object> parameterMap) throws Exception {
		return handler.serviceRead(statementName, parameterMap);
	}
	
	public List<HashMap<String, Object>> serviceProcedure(DefaultDAO handler, String statementName, HashMap<String, Object> parameterMap) throws Exception {
		return handler.serviceProcedure(statementName, parameterMap);
	}
	
	public String serviceReadString(DefaultDAO handler, String statementName, HashMap<String, Object> parameterMap) throws Exception {
		return handler.serviceRreadString(statementName, parameterMap);
	}
	
	public void serviceCreate(DefaultDAO handler, String statementName, HashMap<String, Object> parameterMap) throws Exception {
		handler.serviceCreate(statementName, parameterMap);
	}
	
	public void serviceUpdate(DefaultDAO handler, String statementName, HashMap<String, Object> parameterMap) throws Exception {
		handler.serviceUpdate(statementName, parameterMap);
	}
	
	public void serviceDestroy(DefaultDAO handler, String statementName, HashMap<String, Object> parameterMap) throws Exception {
		handler.serviceDestroy(statementName, parameterMap);
	}
	
	/**
	 * <i>default service</i>
	 * @param handler : DAO (Data Access object)
	 * @param config : received from the client configuration
	 * @param vo : DefaultVO
	 * @param rowindex : to handle configuration row index
	 * @throws Exception
	 */
	public void serviceDefault(DefaultDAO handler, ConfigDataSet config, DefaultVO vo, int rowindex) throws Exception {
		String statementName = config.getSqlID(rowindex);
		List<HashMap<String, Object>> lstData = vo.getReqDataSet(config.getDatasetsSend(rowindex));
		String outDataSetName = config.getDatasetsRecv(rowindex);
		int crudh = config.getTransDv(rowindex);
		HashMap<String, Object> parameterMap = null;
		
		List<HashMap<String, Object>> list = null;
		for (int intB = 0; intB < lstData.size(); intB++) {
			parameterMap = vo.getRowData(crudh, config.getDatasetsSend(rowindex), intB);
			
			switch (crudh) {
			case ConfigDataSet.TRANS_DV_CREATE:
				this.serviceCreate(handler, statementName, parameterMap);
				break;
			case ConfigDataSet.TRANS_DV_READ:
				list = this.serviceRead(handler, statementName, parameterMap);
				vo.getResDatasets().put(outDataSetName, list);
				break;
			case ConfigDataSet.TRANS_DV_UPDATE:
				this.serviceUpdate(handler, statementName, parameterMap);
				break;
			case ConfigDataSet.TRANS_DV_DESTROY	:
				this.serviceDestroy(handler, statementName, parameterMap);
				break;
			case ConfigDataSet.TRANS_DV_PROCEDURE	:
				list = this.serviceProcedure(handler, statementName, parameterMap);
				vo.getResDatasets().put(outDataSetName, list);
				break;
			case ConfigDataSet.TRANS_DV_STT_SEARCH	:
				list = this.serviceRead(handler, statementName, parameterMap);
				vo.getResDatasets().put(outDataSetName, list);
				break;
			}
			
			//if (crudh == ConfigDataSet.TRANS_DV_READ) { break; }
		}
	}
	
	/**
	 * <i>directory file list service</i>
	 * @param handler : DAO (Data Access object)
	 * @param config : received from the client configuration
	 * @param vo : DefaultVO
	 * @param rowindex : to handle configuration row index
	 * @throws Exception
	 */
	public void serviceDir(DefaultDAO handler, ConfigDataSet config, DefaultVO vo, int rowindex) throws UnknownHostException, IOException, Exception{
		FileHandler fhandler = new FileHandler();
		System.out.println("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
		System.out.println(vo);
		System.out.println("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
		fhandler.dir(config, vo, rowindex);
	}
}
