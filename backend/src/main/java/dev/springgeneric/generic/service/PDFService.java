package dev.springgeneric.generic.service;

import com.itextpdf.io.font.FontConstants;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Text;
import org.springframework.http.*;

import javax.swing.text.StyleConstants;
import java.io.IOException;
import java.io.OutputStream;
import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

public class PDFService {
    public <T> void generatePdfFromList(List<T> entities, OutputStream outputStream) throws IOException {
        if (entities.isEmpty()) {
            return;
        }



        Class<?> entityClass = entities.get(0).getClass();
        Field[] fields = entityClass.getDeclaredFields();

        PdfDocument pdfDocument = null;

        try {

            pdfDocument = new PdfDocument(new PdfWriter(outputStream));
            Document document = new Document(pdfDocument);

            // Add a table for the entities
            Table table = new Table(fields.length);

            for (Field field : fields) {
                Cell headerCell = new Cell().add(new Paragraph(field.getName()));
                headerCell.setFont(PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD));

                table.addHeaderCell(headerCell);
            }
            for (T entity : entities) {
                for (Field field : fields) {
                    field.setAccessible(true);
                    try {
                        Object value = field.get(entity);
                        table.addCell(new Cell().add(new Paragraph(value != null ? value.toString() : "")));
                    } catch (IllegalAccessException e) {
                        // Handle exception if necessary
                    }
                }
            }
            document.add(table);
        }catch (Throwable e){
            throw e;
        }finally {

            pdfDocument.close();
        }

    }

    public <T> void generatePdfFromEntity(T entity, OutputStream outputStream) throws IllegalAccessException, IOException {
        Class<?> entityClass = entity.getClass();
        Field[] fields = entityClass.getDeclaredFields();

        PdfDocument pdfDocument = null;

        try {


            pdfDocument = new PdfDocument(new PdfWriter(outputStream));
            Document document = new Document(pdfDocument);

            // Add a card for the entity
            for (Field field : fields) {
                field.setAccessible(true);
                    Object value = field.get(entity);

                Text text = new Text(field.getName());
                text.setFont(PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD));


                Paragraph paragraph = new Paragraph();
                paragraph.add(text);
                paragraph.add(": ");
                paragraph.add(new Text(value != null ? value.toString() : ""));


                document.add(paragraph);

            }

        }catch (Throwable e){
            throw e;
        }finally {

            pdfDocument.close();
        }

    }

    public ResponseEntity<byte[]> getResponse(String filePath,String fileName){

        // Read the PDF file into a byte array
        byte[] pdfBytes;
        try {
            pdfBytes = Files.readAllBytes(Paths.get(filePath));

        // Set the Content-Type header to application/pdf
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);

        // Set the Content-Disposition header to attachment; filename=entities.pdf
        headers.setContentDisposition(ContentDisposition.builder("attachment")
                .filename(fileName)
                .build());

        // Return a ResponseEntity object with the PDF file as the response body and headers
        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
