package com.lmsapp.util;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.graphics.image.LosslessFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFSlide;

import javax.imageio.ImageIO;

import java.awt.Dimension;
import java.awt.Graphics2D;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class ScormUtility {
	public static void main(String[] args) throws IOException {
		convertPPTtoPDF("C:\\Users\\ramak\\OneDrive\\Documents\\abc.pptx", "C:\\Users\\ramak\\OneDrive\\Documents\\xyz.pdf");
		createPDFScormFile("C:\\Users\\ramak\\OneDrive\\Documents\\xyz.pdf");
	}
	
	private static void createPDFScormFile(String fpath) {
        try {
            // Step 1: Extract images from PDF
            File pdfFile = new File(fpath);
            PDDocument document = PDDocument.load(pdfFile);
            File imagesDir = new File("images");
            imagesDir.mkdirs();
            PDFRenderer pdfRenderer = new PDFRenderer(document);
            for (int page = 0; page < document.getNumberOfPages(); ++page) {
                BufferedImage image = pdfRenderer.renderImageWithDPI(page, 300);
                ImageIO.write(image, "png", new File(imagesDir, "image_" + (page + 1) + ".png"));
            }

            // Step 2: Create SCORM package structure
            File scormPackage = new File("scorm_package");
            scormPackage.mkdirs();

            // Step 3: Save HTML file with embedded images
            File htmlFile = new File(scormPackage, "index.html");
            try (PrintWriter writer = new PrintWriter(htmlFile)) {
                writer.write("<html><body>");
                for (int page = 1; page <= document.getNumberOfPages(); ++page) {
                    writer.write("<img src=\"../images/image_" + page + ".png\" style=\"width:100%;\"><br>");
                }
                writer.write("</body></html>");
            }

            // Step 4: Create SCORM manifest file
            File manifestFile = new File(scormPackage, "imsmanifest.xml");
            try (PrintWriter writer = new PrintWriter(manifestFile)) {
                writer.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
                        "<manifest identifier=\"SCO_ID\" version=\"1.0\" xmlns=\"http://www.imsglobal.org/xsd/imscp_v1p1\">\n" +
                        "    <metadata>\n" +
                        "        <schema>ADL SCORM</schema>\n" +
                        "        <schemaversion>1.2</schemaversion>\n" +
                        "    </metadata>\n" +
                        "    <organizations default=\"DEFAULT\">\n" +
                        "        <organization identifier=\"DEFAULT\">\n" +
                        "            <title>Default Organization</title>\n" +
                        "            <item identifier=\"ITEM_ID\" identifierref=\"RESOURCE_ID\">\n" +
                        "                <title>Item Title</title>\n" +
                        "            </item>\n" +
                        "        </organization>\n" +
                        "    </organizations>\n" +
                        "    <resources>\n" +
                        "        <resource identifier=\"RESOURCE_ID\" adlcp:scormtype=\"sco\" href=\"index.html\" type=\"webcontent\">\n" +
                        "            <file href=\"index.html\" />\n" +
                        "            <file href=\"images/\" />\n" +
                        "        </resource>\n" +
                        "    </resources>\n" +
                        "</manifest>");
            }

            // Step 5: Package SCORM content into a ZIP file
            File scormZipFile = new File("scorm_package.zip");
            zipDirectory(scormPackage, scormZipFile);

            System.out.println("SCORM package created successfully: " + scormZipFile.getAbsolutePath());

            // Close the document when done
            document.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Utility method to zip a directory
    private static void zipDirectory(File directory, File zipFile) throws IOException {
        try (ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(zipFile))) {
            zip(directory, directory, zos);
        }
    }
    
    // Recursive method to zip a directory
    private static void zip(File rootDir, File source, ZipOutputStream zos) throws IOException {
        File[] files = source.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isDirectory()) {
                    zip(rootDir, file, zos);
                } else {
                    String relativePath = rootDir.toURI().relativize(file.toURI()).getPath();
                    ZipEntry entry = new ZipEntry(relativePath);
                    zos.putNextEntry(entry);
                    try (BufferedInputStream bis = new BufferedInputStream(new FileInputStream(file))) {
                        byte[] buffer = new byte[1024];
                        int bytesRead;
                        while ((bytesRead = bis.read(buffer)) != -1) {
                            zos.write(buffer, 0, bytesRead);
                        }
                    }
                    zos.closeEntry();
                }
            }
        }
    }
    
    public static void convertPPTtoPDF(String pptFilePath, String pdfFilePath) throws IOException {
        try (FileInputStream fis = new FileInputStream(pptFilePath);
             FileOutputStream fos = new FileOutputStream(pdfFilePath);
             XMLSlideShow ppt = new XMLSlideShow(fis);
             PDDocument pdf = new PDDocument()) {

            for (XSLFSlide slide : ppt.getSlides()) {
                PDPage pdfPage = new PDPage();
                pdf.addPage(pdfPage);

                try (PDPageContentStream contentStream = new PDPageContentStream(pdf, pdfPage)) {
                    Dimension pageSize = new Dimension((int) pdfPage.getBBox().getWidth(), (int) pdfPage.getBBox().getHeight());
                    contentStream.drawImage(convertSlideToPDImage(slide, pdf, pageSize), 0, 0);
                }
            }

            pdf.save(fos);
        }
    }

    private static PDImageXObject convertSlideToPDImage(XSLFSlide slide, PDDocument pdf, Dimension pageSize) throws IOException {
        BufferedImage img = new BufferedImage((int) pageSize.getWidth(), (int) pageSize.getHeight(), BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = img.createGraphics();
        graphics.setTransform(new AffineTransform());
        graphics.clearRect(0, 0, img.getWidth(), img.getHeight());

        // Draw the slide onto the BufferedImage
        slide.draw(graphics);

        // Convert BufferedImage to PDImageXObject
        return LosslessFactory.createFromImage(pdf, img);
    }

}
