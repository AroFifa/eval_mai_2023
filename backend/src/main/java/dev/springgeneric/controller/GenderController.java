package dev.springgeneric.controller;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.AreaBreak;
import com.itextpdf.layout.element.Paragraph;
import dev.springgeneric.generic.controller.BaseController;
import dev.springgeneric.generic.service.PDFService;
import dev.springgeneric.model.Gender;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import javax.swing.filechooser.FileSystemView;
import java.awt.*;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;

@RestController
@RequestMapping("/genders")
public class GenderController extends BaseController<Gender,String> {
    @Override
    protected Class<Gender> getEntityClass() {
        return Gender.class;
    }

    @GetMapping("/sql")
    public ResponseEntity<Page<Gender>> find(Pageable pageable){
        Page<Gender> genders = repository.findBySQL("SELECT * from Gender where gendername like ? and gendername like ?",getEntityClass(),pageable,"%mm%","%fe%");

        return new ResponseEntity<>(genders,HttpStatus.OK);
    }


}
