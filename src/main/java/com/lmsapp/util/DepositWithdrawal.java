package com.lmsapp.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class DepositWithdrawal {
    public static void main(String[] args) {
        // Specify the path to your text file
        String filePath = "C:\\Users\\ramak\\OneDrive\\Desktop\\22_23.txt";

        String output = "C:\\Users\\ramak\\OneDrive\\Desktop\\deposits_withdrawls_22_23.csv";
        // Use try-with-resources to automatically close the BufferedReader
        try (BufferedReader br = new BufferedReader(new FileReader(filePath));
        		BufferedWriter bw = new BufferedWriter(new FileWriter(output))) {
            String line;

            // Read each line from the file until the end is reached (null is returned)
            while ((line = br.readLine()) != null) {
                if(line.startsWith("Withdrawn")) {
                	//System.out.println(line);
                	String nextLine = br.readLine();
                	//System.out.println(nextLine);
                	String deposit = nextLine.split(" ")[0].replace(",", "");
                	String withdraw = nextLine.split(" ")[6].replace(",", "");
                	//System.out.println(deposit+" - "+withdraw);
                	float profitloss = Float.parseFloat(withdraw)-Float.parseFloat(deposit);
                	bw.write(deposit+","+withdraw+","+profitloss);
                	bw.newLine();                	
                }else if(line.startsWith("Cash Deposit Tournament Winnings Amount Withdrawn")) {
                	String nextLine = br.readLine();
                	System.out.println(nextLine);
                	String deposit = nextLine.split(" ")[0].replace(",", "");
                	String withdraw = nextLine.split(" ")[2].replace(",", "");
                	//System.out.println(deposit+" - "+withdraw);
                	float profitloss = Float.parseFloat(withdraw)-Float.parseFloat(deposit);
                	bw.write(deposit+","+withdraw+","+profitloss);
                	bw.newLine(); 
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
