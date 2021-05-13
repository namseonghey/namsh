package kr.co.itfact.scrm.json.common;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Service;

import kr.co.itfact.scrm.common.DefaultConstants;

@Service
public class ResponseServiceImpl implements ResponseService {

	@Override
	public void response(HttpServletResponse response, String result) {
		response.setCharacterEncoding(DefaultConstants.CHARSET_UTF8);
		PrintWriter writer		= null;
		try {
			writer	= response.getWriter();
			writer.write(result);
			writer.flush();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (writer != null) {
				writer.close();
			}
		}
	}
}
