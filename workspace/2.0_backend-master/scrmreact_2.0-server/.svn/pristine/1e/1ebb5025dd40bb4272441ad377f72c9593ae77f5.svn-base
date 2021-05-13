package kr.co.itfact.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtils {

	public static boolean isValidDate(String date, String format) {
		boolean value = true;
		
		SimpleDateFormat sdformat = new SimpleDateFormat(format);
		sdformat.setLenient(false);
		
		try {
			sdformat.parse(date);
		} catch (ParseException e) {
			value = false;
		}
		
		return value;
	}
	
	public static String convertDate(String date, String fromFormat, String toFormat) {
		String value = null;
		SimpleDateFormat format = new SimpleDateFormat(fromFormat);
		format.setLenient(false);
		
		try {
			value = new SimpleDateFormat(toFormat).format(format.parse(date));
		} catch (ParseException e) {
			value = null;
		} catch (Exception e) {
			value = null;
		}
		
		return value;
	}
	
	public static String asString(String format) {
		if (format == null || format.equals("")) {
			format = "yyyyMMddHHmmss";
		}
		return new SimpleDateFormat(format).format(new Date());
	}
}
