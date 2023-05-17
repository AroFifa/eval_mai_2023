package dev.springgeneric.generic.controller;

import dev.springgeneric.generic.face.BaseEntity;
import dev.springgeneric.generic.repo.GenericRepository;
import dev.springgeneric.generic.service.PDFService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import javax.swing.filechooser.FileSystemView;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;


public abstract class BaseController<T extends BaseEntity<ID>, ID> {

    @Autowired
    protected GenericRepository repository;

    @PostMapping
    public ResponseEntity<T> save(@RequestBody T entity) {
        T savedEntity = repository.save(entity);
        return new ResponseEntity<>(savedEntity, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<T> update(@PathVariable ID id, @RequestBody T entity) {
        entity.setId(id);
        T updatedEntity = repository.update(entity);
        return new ResponseEntity<>(updatedEntity, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity  delete(@PathVariable ID id){

        T entity = repository.find(getEntityClass(), id);
        if (entity == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        repository.delete(getEntityClass(),id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @GetMapping
    public ResponseEntity<Page<T>> findAll(Pageable pageable) {
        Page<T> entities = repository.findAll(getEntityClass(), pageable);
        return new ResponseEntity<>(entities, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<T> findById(@PathVariable ID id) {
        T entity = repository.find(getEntityClass(),id);
        if(entity==null)
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(entity, HttpStatus.OK);
    }

    @PostMapping("/search")
    public ResponseEntity<Page<T>> search(@RequestBody T entity,Pageable pageable){
        try {
            Page<T> entities = repository.findBy(entity,pageable);
            return new ResponseEntity<>(entities,HttpStatus.OK);
        } catch (IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/create-pdf/{id}")
    public ResponseEntity<byte[]> generatePdf(@PathVariable ID id,Pageable pageable) {
        String fileName = getEntityClass().getSimpleName()+"_"+id;
        File downloadDir = FileSystemView.getFileSystemView().getDefaultDirectory();
        String filePath = downloadDir.getAbsolutePath() + File.separator + fileName;

        try {

            T entity = repository.find(getEntityClass(),id);
            if(entity==null)
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            PDFService service= new PDFService();
            service.generatePdfFromEntity(entity,new FileOutputStream(filePath));


            return service.getResponse(filePath,fileName);
        } catch (Throwable e) {
            throw new RuntimeException(e);
        }

    }

    @GetMapping("/create-pdf")
    public ResponseEntity<byte[]> generatePdf(Pageable pageable) {
        String fileName = getEntityClass().getSimpleName();
        File downloadDir = FileSystemView.getFileSystemView().getDefaultDirectory();
        String filePath = downloadDir.getAbsolutePath() + File.separator + fileName;

        try {


            PDFService service= new PDFService();
            service.generatePdfFromList(repository.findAll(getEntityClass(),pageable).getContent(),new FileOutputStream(filePath));


            return service.getResponse(filePath,fileName);
        } catch (Throwable e) {
            throw new RuntimeException(e);
        }

    }
    protected abstract Class<T> getEntityClass();




}
