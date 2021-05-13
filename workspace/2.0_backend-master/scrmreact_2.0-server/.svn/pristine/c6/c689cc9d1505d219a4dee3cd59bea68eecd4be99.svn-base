package kr.co.itfact.scrm.json.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import kr.co.itfact.scrm.json.vo.DefaultVO;

/**
 * 
 * <i>Note: The DefaultService class is the default service object for the transaction using json</br></i>
* </br>
 * 
 * @author choi woo keun ( wookeun.choi@gmail.com )
 * @version 1.0
 * @since 2014.03.12
 *
 */
public interface DefaultService {
	public void service(DefaultVO vo) throws Exception;
	public List<HashMap<String, Object>> serviceBatch(String jobName, HashMap<String, Object> param) throws Exception;
	public void serviceUpload(List<MultipartFile> files) throws Exception;
}
