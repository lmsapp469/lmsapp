package com.lmsapp.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class ReadFileExample {
    public static void main(String[] args) {
        // Specify the path to your text file
        String filePath = "C:\\Users\\ramak\\OneDrive\\Desktop\\games.txt";

        String output = "C:\\Users\\ramak\\OneDrive\\Desktop\\output_games.csv";
        // Use try-with-resources to automatically close the BufferedReader
        try (BufferedReader br = new BufferedReader(new FileReader(filePath));
        		BufferedWriter bw = new BufferedWriter(new FileWriter(output))) {
            String line;

            // Read each line from the file until the end is reached (null is returned)
            while ((line = br.readLine()) != null) {
                if(line.contains("Winnings")) {
                	//System.out.println(line);
                	String nextLine = br.readLine();
                	while(!nextLine.contains("Join")) {
                		nextLine = br.readLine();
                	}
                	String date = nextLine.substring(0,22).replace(",", "").trim();
                	int indexOfAsh = nextLine.indexOf('#');
                	String gameId = nextLine.substring(indexOfAsh, indexOfAsh+10);
                	String invest = (nextLine.substring(indexOfAsh+11)).split(" ")[0].replace(",", "").trim();
                	int winIndex = line.indexOf(gameId);
                	String winning = (line.substring(winIndex+11)).split(" ")[0].replace(",", "").trim();
                	float profit = Float.parseFloat(winning)-Float.parseFloat(invest);
                	//System.out.println(date+","+gameId+","+invest+","+winning+","+profit);
                	bw.write(date+","+gameId+","+invest+","+winning+","+profit);
                    bw.newLine();
                	
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}