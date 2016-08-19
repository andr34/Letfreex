package com.netfreex.plugin;
import java.net.*;
import java.io.*;
import java.nio.charset.Charset;
import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;
import java.util.Scanner;

public class Rapidvideo extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray data, CallbackContext callbackContext) throws JSONException {

        if (action.equals("extract")) {
			try{
				String id = data.getString(0);
				
				
				String url = "http://www.rapidvideo.org/embed-"+id+"-607x360.html";

				URL obj = new URL(url);
				String content = null;
				
				StringBuilder sb = new StringBuilder();
				URLConnection urlConn = null;
				InputStreamReader inn = null;
				
				urlConn = obj.openConnection();
				if (urlConn != null)
					urlConn.setReadTimeout(60 * 1000);
				if (urlConn != null && urlConn.getInputStream() != null) {
					inn = new InputStreamReader(urlConn.getInputStream(),
							Charset.defaultCharset());
					BufferedReader bufferedReader = new BufferedReader(inn);
					if (bufferedReader != null) {
						int cp;
						while ((cp = bufferedReader.read()) != -1) {
							sb.append((char) cp);
						}
						bufferedReader.close();
					}
				}
				inn.close();
				
				content = sb.toString();
				
				content = "eval"+content.split("<script type='text/javascript'>eval")[1].split("</script>")[0];
				
				callbackContext.success(content);
				
				
			}catch(Exception ex)
			{
				callbackContext.error(ex.toString());
			}
            

            return true;

        } else {
            
            return false;

        }
    }
}
