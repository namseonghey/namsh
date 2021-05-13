package kr.co.itfact.scrm.batch.handler;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.web.context.ContextLoader;

/**
 *
 * <i>The SpringBatchHandler class is that you often have to manually process the spring batch</i>
 * 
 * @author choi woo keun ( wookeun.choi@gmail.com )
 * @version 1.0
 * @since 2016.04.26
 */
public class SpringBatchHandler {
	public static final String RESULT = "result";
	public static final String MESSAGE = "message";
	public static final String RESPONSE = "reponse";
	public static final int SUCCESS_CODE = 0;
	public static final int ERROR_CODE = 1;

	private JobLauncher jobLauncher = null;
	
	/**
	 * Default constructor
	 */
	public SpringBatchHandler() {}
	
	/**
	 * Constructor
	 * @param jobLauncher spring batch job launcher : org.springframework.batch.core.launch.JobLauncher
	 */
	public SpringBatchHandler(JobLauncher jobLauncher) {
		this.jobLauncher = jobLauncher;
	}
	
	/**
	 * After running the spring batch and returns the results
	 * @param jobName The jobName is the name defined int the configuration xml <i>ex) xxx-batch-job.xml</i>
	 * @param param The param are parameters for executing the spring batch job
	 * @return batch run results <i>( Set the result of the argument param : start.time, end.time, result.division, exception.message ... )</i>
	 */
	public List<HashMap<String, Object>> handle (String jobName, HashMap<String, Object> param) {
		Iterator<String> iter = null;
		String paramkey = null;
		List<HashMap<String, Object>> result = null;
		
		JobExecution jobExecution = null;
		Job job = null;
		JobParametersBuilder builder = null;
		
		try {
			builder = new JobParametersBuilder();
			builder.addLong("execute.time", System.currentTimeMillis());
			
			iter = param.keySet().iterator();
			while (iter.hasNext()) {
				paramkey = iter.next();
				builder.addString(paramkey, param.get(paramkey).toString());
			}
			
			try {
				job = (Job)ContextLoader.getCurrentWebApplicationContext().getBean(jobName);
				jobExecution = this.jobLauncher.run(job, builder.toJobParameters());
			} catch (Exception e) {
				param.put("start.time", (new SimpleDateFormat("yyyyMMddHHmmss")).format(jobExecution.getStartTime()));
				param.put("end.time", (new SimpleDateFormat("yyyyMMddHHmmss")).format(jobExecution.getEndTime()));
				param.put("result.division", "fail");
				param.put("exception.message", e.getClass().getName() + " : " + e.getMessage());
			}
			
			param.put("start.time", (new SimpleDateFormat("yyyyMMddHHmmss")).format(jobExecution.getStartTime()));
			param.put("end.time", (new SimpleDateFormat("yyyyMMddHHmmss")).format(jobExecution.getEndTime()));
			param.put("result.division", "success");
			param.put("exception.message", "");
			param.put("total", jobExecution.getExecutionContext().get("total"));
			param.put("success", jobExecution.getExecutionContext().get("success"));
			param.put("fail", jobExecution.getExecutionContext().get("fail"));
		} catch (Exception e) {
			if (param == null) {
				param = new HashMap<String, Object>();
			}
			param.put("start.time", "");
			param.put("end.time", "");
			param.put("result.division", "fail");
			param.put("exception.message", e.getClass().getName() + " : " + e.getMessage());
			param.put("total", null);
			param.put("success", null);
			param.put("fail", null);
		} finally {
			result = new ArrayList<HashMap<String, Object>>();
			result.add(param);
		}
		
		return result;
	}
}
