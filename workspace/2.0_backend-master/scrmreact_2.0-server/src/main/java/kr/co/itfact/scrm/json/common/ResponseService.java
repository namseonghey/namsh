package kr.co.itfact.scrm.json.common;

import javax.servlet.http.HttpServletResponse;

public interface ResponseService {
	public void response(HttpServletResponse response, String result);
}
