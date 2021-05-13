package kr.co.itfact.scrm.json.filter;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CorsFilter implements Filter {
	
	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) req;
		//System.out.println("CORSFilter HTTP Request: " + request.getMethod());
		
		((HttpServletResponse) res).addHeader("Access-Control-Allow-Origin", "*");
		((HttpServletResponse) res).addHeader("Access-Control-Allow-Methods","GET, HEAD, PUT, POST");
		((HttpServletResponse) res).addHeader("Access-Control-Allow-Headers","*");
		
		HttpServletResponse resp = (HttpServletResponse) res;
		
		if (request.getMethod().equals("OPTIONS")) {
			resp.setStatus(HttpServletResponse.SC_ACCEPTED);
			return;
		}
		
		chain.doFilter(request, res);
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		
	}

	@Override
	public void destroy() {
		
	}
}