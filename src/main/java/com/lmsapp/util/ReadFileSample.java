package com.lmsapp.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class ReadFileSample {
    public static void main(String[] args) {
        // Specify the path to your text file
        String filePath = "C:\\Users\\ramak\\OneDrive\\Desktop\\22_23.txt";
        String output = "C:\\Users\\ramak\\OneDrive\\Desktop\\output_22_23.csv";
        // Use try-with-resources to automatically close the BufferedReader
        try (BufferedReader br = new BufferedReader(new FileReader(filePath));
        		BufferedWriter bw = new BufferedWriter(new FileWriter(output))) {
        	
        	List<String> lines = new ArrayList<>();
        	String line;
        	while ((line = br.readLine()) != null) {
                lines.add(line);
            }
        	
        	List<String> joinings = new ArrayList<>();
        	List<String> joingameIds = new ArrayList<>();
        	List<String> winnings = new ArrayList<>();
        	List<String> wingameIds = new ArrayList<>();
            // Read each line from the file until the end is reached (null is returned)
        	for (int i = lines.size() - 1; i >= 0; i--) {
        		String currentLine = lines.get(i);
        		if(currentLine.contains("Join")) {
        			joinings.add(currentLine);
        			int indexOfAsh = currentLine.indexOf('#');
            		String gameId = currentLine.substring(indexOfAsh, indexOfAsh+10);
            		joingameIds.add(gameId);
        		}else if(currentLine.contains("Winnings of")) {
        			winnings.add(currentLine);
        			int indexOfAsh = currentLine.indexOf('#');
            		String gameId = currentLine.substring(indexOfAsh, indexOfAsh+10);
            		wingameIds.add(gameId);
        		}
            }
        	for(String join: joinings) {
        		int indexOfAsh = join.indexOf('#');
        		String gameId = join.substring(indexOfAsh, indexOfAsh+10);
        		if(wingameIds.contains(gameId)) {
        			int index = wingameIds.indexOf(gameId);
        			String winrow = winnings.get(index);
        			String invest = join.split(" ")[9].replace(",", "").trim();//(join.substring(indexOfAsh+11)).split(" ")[0].replace(",", "").trim();
        			String date = winrow.substring(0,22).replace(",", "").trim();
        			int winIndex = winrow.indexOf(gameId);
                	String winning = winrow.split(" ")[10].replace(",", "").trim();//(winrow.substring(winIndex+11)).split(" ")[0].replace(",", "").trim();
                	//System.out.println(gameId);
                	float profit = Float.parseFloat(winning)-Float.parseFloat(invest);
        			//System.out.println(date+","+gameId+","+invest+","+winning+","+profit);
        			bw.write(date+","+gameId+","+invest+","+winning+","+profit+","+0);
        			bw.newLine();
        		}else {
        			int index = joingameIds.indexOf(gameId);
        			String lossrow = joinings.get(index);
        			String invest = join.split(" ")[9].replace(",", "").trim();//(join.substring(indexOfAsh+11)).split(" ")[0].replace(",", "").trim();
        			String date = lossrow.substring(0,22).replace(",", "").trim();
        			//System.out.println(date+","+gameId+","+invest+","+0+",-"+invest);
        			bw.write(date+","+gameId+","+invest+","+0+","+0+",-"+invest);
        			bw.newLine();
        		}
        	}
        	
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
