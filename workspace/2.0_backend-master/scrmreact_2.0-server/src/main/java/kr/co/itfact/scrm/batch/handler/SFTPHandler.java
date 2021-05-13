/******************************************************************************************************
* @파일명		: kr.co.itfact.scrm.json.handler.SFTPHandler.java
* @목적			: SFTP Handler 파일
* @상위파일		: 
* @하위파일		: 
* @플로우		: SFTP Handler 파일
* @검수			: 
* @작성자		: kim hyun il
* @생성일		: 2016.08.03
* @수정이력
-----------------------------------------------------------------------------
No.		일자				수정자			설명
-----------------------------------------------------------------------------
1		 2016.08.03 	kim hyun il		최초 작성
******************************************************************************************************/
package kr.co.itfact.scrm.batch.handler;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Vector;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpException;

/**
 * @author User
 *
 */
public class SFTPHandler {
	private final Logger logger = LoggerFactory.getLogger(SFTPHandler.class);
	
	private Session session  = null;
	private Channel channel = null;
	private ChannelSftp channelSftp = null;
	
	/**
	 * ftp정보초기화
	 * @param host - 서버ip
	 * @param userName - 접속계정
	 * @param password - 접속패스워드
	 * @param port - 접속포트
	 */
	public void init(String host, String userName, String password, int port) throws JSchException{
		JSch jsch = new JSch();

		session = jsch.getSession(userName, host, port);
		session.setPassword(password);
		
		java.util.Properties config = new java.util.Properties();
		config.put("StrictHostKeyChecking", "no");
		
		session.setConfig(config);
		session.connect();
		
		channel = session.openChannel("sftp");
		channel.connect();
		
		channelSftp = (ChannelSftp)channel;
	}
	
	/**
	 * 인자로 받은 경로의 파일리스트 리턴
	 * @param path
	 * @return
	 */
	public Vector<ChannelSftp.LsEntry> getFileList(String path) throws SftpException{
		Vector<ChannelSftp.LsEntry> list = null;
		
		logger.debug("SFTP password : " + channelSftp.pwd());
		channelSftp.cd(path);
		list = channelSftp.ls(".");
		
		return list;
	}
	
	/**
	 * 단일파일 - 업로드
	 * @param dir - 저장시킬 주소(서버)
	 * @param file - 저장할 파일
	 */
	public void upload(String dir, File file) throws SftpException, FileNotFoundException, IOException{
		FileInputStream in = null;
		in = new FileInputStream(file);
		channelSftp.cd(dir);
		channelSftp.put(in, file.getName());
		
		if(in != null){
			in.close();
		}
	}
	
	/**
	 * 단일파일 - 다운로드
	 * @param dir - 저장할 경로(서버)
	 * @param downloadFileName - 다운로드할 파일
	 * @param path - 저장될 공간
	 */
	public void download(String dir, String downloadFileName, String path) throws SftpException, IOException{
		 InputStream in = null;
		 FileOutputStream out = null;
		 
		 channelSftp.cd(dir);
		 in = channelSftp.get(downloadFileName);
		 
		 out = new FileOutputStream(new File(path));
		 int intRead;
		 
		 while((intRead = in.read())!= -1){
			 out.write(intRead);
		 }
		 
		 out.close();
		 in.close();
	}
	
	/**
	 * 서버와의 연결종료
	 */
	public void disconnection(){
		channelSftp.quit();
	}
}
