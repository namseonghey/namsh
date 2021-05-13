/******************************************************************************************************
* @파일명		: kr.co.itfact.scrm.batch.handler.FTPHandler.java
* @목적			: FTP처리 핸들러
* @상위파일	: 
* @하위파일	: 
* @플로우		: FTP처리 핸들러
* @검수			: 
* @작성자		: choi woo keun
* @생성일		: 2013.10.07
* @수정이력
-----------------------------------------------------------------------------
No.		일자			수정자			설명
-----------------------------------------------------------------------------
1		 2013.11.28 	choi woo keun	주석 수정
******************************************************************************************************/
package kr.co.itfact.scrm.batch.handler;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.SocketException;
import java.util.StringTokenizer;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.ftp.FTPReply;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 
 * @author itfact
 *
 */
public class FTPHandler {
	private final Logger logger = LoggerFactory.getLogger(FTPHandler.class);
	
	private FTPClient client = new FTPClient();
	public static final int ASCII = FTP.ASCII_FILE_TYPE;
	public static final int BINARY = FTP.BINARY_FILE_TYPE;

	private String server;
	private String user;
	private String passwd;

	public FTPHandler() {}
		
	public FTPHandler(String server, String user, String passwd){
			this.server = server;
			this.user   = user;
			this.passwd = passwd;
	}

	public boolean connect(String ipaddr, String uname, String passwd) {
		return connect(ipaddr, uname, passwd, FTP.DEFAULT_PORT);
	}
	
	public boolean connect(String ipaddr, String uname, String passwd, String portStr) {
		if(NumberUtils.isNumber(portStr)) {
			return connect(ipaddr, uname, passwd, NumberUtils.toInt(portStr));
		} else {
			return connect(ipaddr, uname, passwd, FTP.DEFAULT_PORT);
		}
	}
	
	public boolean connect(String ipaddr, String uname, String passwd, int port) {
		try {
			
			this.client.connect(ipaddr, port);
			int reply = client.getReplyCode();

			if (!FTPReply.isPositiveCompletion(reply)) {
				client.disconnect();
				if (logger.isDebugEnabled()) logger.debug("connect fail ...");
				return false;
			}
			
			return this.client.login(uname, passwd);
		} catch (SocketException e) {
			throw new RuntimeException(e);
		} catch(IOException e) {
			throw new RuntimeException(e);
		}
	}
	
	public void mode(int m) {
		try{
			this.client.setFileTransferMode(m);
		}catch(IOException e){
			throw new RuntimeException(e);
		}
	}

	public void fileType(int type){
		try{
			client.setFileType(type);
		}catch(IOException e){
			throw new RuntimeException(e);
		}
	}
	
	public void setPassiveMode() {
		this.client.enterLocalPassiveMode();
	}
	
	public boolean upload(String path, File f) {
		
		InputStream is = null;
		int reply = 0;
		try {
			
			if (logger.isDebugEnabled()) logger.debug("@@@@@@@@@@@@@@@@@@@@@ upload entered@@@@@@@@@@@@@@@@@ ");
			
			if (logger.isDebugEnabled()) logger.debug("file exists ??? " + f.exists());
			
			if(!f.exists()){
				return false;
			}
			
			is = new FileInputStream(f);
			
			if (logger.isDebugEnabled()) logger.debug("upload full name ??? " + path + f.getName());
			
			boolean rs = this.client.storeFile(path + f.getName(), is);
			reply = client.getReplyCode();
			
			if (logger.isDebugEnabled()) logger.debug("\n=========================================================\n");
			if (logger.isDebugEnabled()) logger.debug("Reply Code ??? " + reply);
			if (logger.isDebugEnabled()) logger.debug("\n=========================================================\n");
			
			return rs;
		} catch (FileNotFoundException e) {
			throw new RuntimeException(e);
		} catch(IOException e) {
			throw new RuntimeException(e);
		} finally {
			try {
				if ( is != null ){
					is.close();
				}
			}catch (IOException e){
				if (logger.isDebugEnabled()) logger.debug("Do Nothing ...");				
			}
		}
	}
	
	public boolean fileChgUpload(String path, File f, String strChgName){
		InputStream is = null;
		int reply = 0;
		boolean	isExistDir = false;
		try{
			if (logger.isDebugEnabled()) logger.debug("@@@@@@@@@@@@@@@@@@@@@ upload entered@@@@@@@@@@@@@@@@@ ");
			
			if (logger.isDebugEnabled()) logger.debug("file exists ??? " + f.exists());
			
			if(!f.exists()){
				return false;
			}
			
			if (!isExistDirectory(path)) {
				makeDirectory(path);
			}
			
			if (path.length() != 0) {
				this.client.changeWorkingDirectory("/");
				this.client.changeWorkingDirectory(path);
			}
			
			if (logger.isDebugEnabled()) logger.debug("upload full name ??? " + path + f.getName());
			is = new FileInputStream(f);
			
			boolean rs = this.client.storeFile(path + strChgName, is);
			reply = client.getReplyCode();
	
			if (logger.isDebugEnabled()) logger.debug("\n=========================================================\n");
			if (logger.isDebugEnabled()) logger.debug("Reply Code ??? " + reply);
			if (logger.isDebugEnabled()) logger.debug("\n=========================================================\n");
			
			return rs;
		} catch (FileNotFoundException e){
			throw new RuntimeException(e);
		} catch(IOException e){
			throw new RuntimeException(e);
		} catch (Exception e) {
			throw new RuntimeException(e.getMessage());
		} finally {
			try {
				if ( is != null ) {
					is.close();
				}
			} catch (IOException e) {
				if (logger.isDebugEnabled()) logger.debug("Do Nothing ...");
			}
		}
	}
	
	public boolean isExistDirectory(String strDir) {
		boolean isExist = false;
		String strRootDir = "";
		String strChildDir = "";
		
		if (strDir.contains("/")) {
			strRootDir = strDir.substring(0, strDir.lastIndexOf("/"));
			strChildDir = strDir.substring(strDir.lastIndexOf("/")+1, strDir.length());
		} else {
			strRootDir = "";
			strChildDir = strDir;
		}
		
		try {
			FTPFile[] arrFileList = null;
			
			if("".equals(strRootDir)) {
				arrFileList = client.listFiles();
			} else {
				arrFileList = client.listFiles(strRootDir);
			}
			
			for (int intLoopA= 0; intLoopA < arrFileList.length; intLoopA++) {
				FTPFile objFile = arrFileList[intLoopA];
				if (objFile.isDirectory() && objFile.getName().equalsIgnoreCase(strChildDir)) {
					isExist = true;
					break;
				}
			}
			
		} catch (IOException e){
				isExist = false;		
		} catch (Exception e){
				isExist = false;
		}
		return isExist;
	}
	
	public void makeDirectory(String strDir) throws Exception {
		String strPath = "";
		String strTempPath = "";
		client.setFileType(FTP.ASCII_FILE_TYPE);
		try {
			StringTokenizer stDir = new StringTokenizer(strDir, "/");
			
			stDir.countTokens();
			while (stDir.hasMoreElements()) {
				String strCurDir = (String)stDir.nextElement();
				
				if (strCurDir == null || strCurDir.length() == 0) {
					continue;
				}
				
				if ("".equals(strPath)) {
					strTempPath = "";
				} else {
					strTempPath = "/";
				}
				strPath += strTempPath + strCurDir;
				
				if (!isExistDirectory(strPath)) {
					boolean isRslt = client.makeDirectory(strPath);
					
					if(!isRslt) {
						throw new Exception("Permission denied");
					}
				}
			}
			
			client.setFileType(FTP.BINARY_FILE_TYPE);
		} catch (Exception e) {
			throw e;
		}
	}
	/**
	 * zeus
	 * @param strRemote
	 * @param path
	 */
	public void downloadList(String strRemote, String path) {
		
		FileOutputStream os = null;
		
    	try {
    		
    		if (logger.isDebugEnabled()) logger.debug("downloadList strRemote [" + strRemote +"]");
    		
    		os = new FileOutputStream(path + StringUtils.substringAfterLast(strRemote, "/"));
    		
			boolean isSucs = client.retrieveFile(strRemote, os);
			
			if (logger.isDebugEnabled()) logger.debug("isSucs : " + isSucs); 
		} catch (FileNotFoundException e) {
			logger.error("[ERROR] FTPHandler.java downloadList FileNotFoundException ");
		} catch (IOException e) {
			logger.error("[ERROR] FTPHandler.java downloadList IOException ");
		}finally {
            try{
				if ( os != null ){
					os.close();
				}
            }  catch (IOException e){
            	if (logger.isDebugEnabled()) logger.debug("Do Nothing ...");				
			}
		}
	}
	

	public void download(String fname, String path){
		
		FileOutputStream os = null;
        InputStream is = null;
		try{
			
			if (logger.isDebugEnabled()) logger.debug("down target file :: " + fname );
			
			is = client.retrieveFileStream(fname);

			os = new FileOutputStream(new File(path + StringUtils.substringAfterLast(fname, "/")));
            
            int rtn = IOUtils.copy(is, os);
			
            if (logger.isDebugEnabled()) logger.debug("send reply :: " + client.getReplyCode());			
            if (logger.isDebugEnabled()) logger.debug("download rtn :: " + rtn);
			
		} catch(IOException e){
			throw new RuntimeException(e);
		} finally{
            try {
                if ( is != null ){
					is.close();
				}
            } catch (IOException e){
            	if (logger.isDebugEnabled()) logger.debug("Do Nothing ...");
				
			}

            try{
				if ( os != null ){
					os.close();
				}
            }  catch (IOException e){
            	if (logger.isDebugEnabled()) logger.debug("Do Nothing ...");				
			}
		}
	}
	
	
	public boolean delete(String fname){
		int reply = 0;
		try {

            boolean rs = client.deleteFile(fname);
            reply = client.getReplyCode();
            
            //file not found!
            if(reply == 450){ return true; }

            if (logger.isDebugEnabled()) logger.debug("send reply :: " + reply);
            if (logger.isDebugEnabled()) logger.debug("send result :: " + rs);

            return rs;
		}catch(IOException e){
			logger.error("[ERROR] FTPHandler delete IOException ");
			throw new RuntimeException(e);
		}	
	}


    public void disconnect(){
    	if (logger.isDebugEnabled()) logger.debug("disconnect ...");

		try{
			this.client.disconnect();
		}catch(IOException e){
			if (logger.isDebugEnabled()) logger.debug("Do Nothing ...");
		}

		if (logger.isDebugEnabled()) logger.debug("disconnect success ...");

	}
    
	public boolean upLoadFile(String fileName, String inFilePath, String outFilePath)	throws Exception {
		
		FileInputStream is = null;
		int reply = 0;

		try{

			client.setControlEncoding("8859_1");
			client.connect(server);
			reply = client.getReplyCode();

			if (!FTPReply.isPositiveCompletion(reply)) {
				client.disconnect();
				if (logger.isDebugEnabled()) logger.debug("FTP server refused connection.");
				return false;
			}

			client.login(user, passwd);
			client.setFileType(this.BINARY);

			is = new FileInputStream(inFilePath+fileName);
			
			if (logger.isDebugEnabled()) logger.debug("upload local file : " + inFilePath+fileName);

			boolean rs = client.storeFile(outFilePath + "/" + fileName , is);
			
			if (logger.isDebugEnabled()) logger.debug("upload remote file :: " + outFilePath + "/" + fileName + "\nresult :: " + rs);
			
			client.logout();
			
		} catch (IOException e) {
			logger.error("[ERROR] FTPHandler upLoadFile IOException ");
			return false;			
		} finally {
			
			if (client.isConnected()) {
				try {
					client.disconnect();
					if (logger.isDebugEnabled()) logger.debug("FTP server disconnected! : " + server);
				} catch (IOException e) {
					logger.debug(e.toString());
				}
			}
			
			try{
				if(is != null){
					is.close();
				}				
			} catch (IOException e) {
				if (logger.isDebugEnabled()) logger.debug(e.toString());
			}
		}
		return true;
	}
	
	public boolean changeWorkingDirectory(String pathname) throws IOException {
		return client.changeWorkingDirectory(pathname);
	}
	
	public String[] listNames(String pathname) throws IOException {
		return client.listNames(pathname);
	}
	
	public FTPFile[] listFiles() throws IOException {
		return client.listFiles();
	}
	
	public FTPFile[] listFiles(String pathname) throws IOException {
		return client.listFiles(pathname);
	}
	
	public void setControlEncoding(String encoding) {
		this.client.setControlEncoding(encoding);
	}
	
	public boolean sendSiteCommand(String command) throws IOException {
		return this.client.sendSiteCommand(command);
	}

}
