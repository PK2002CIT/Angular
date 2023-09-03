
const express = require('express');
const connection = require('../connection')
const router = express.Router();
let ejs = require('ejs')
let pdf = require('html-pdf')
let path = require('path')
var fs = require('fs')
var uuid = require('uuid')
require("dotenv").config();


router.post('/generateReport',(req,res)=>{
    const generateUuid = uuid.v1();
    const orderDetails = req.body;
    var productDetailsReport = JSON.parse(orderDetails.productDetails);

    query = "insert into bill (name,uuid,email,contactNumber,paymentMethod,total,productDetails,createdBy) values (?,?,?,?,?,?,?,?)";
    connection.query(query,[orderDetails.name,generateUuid,orderDetails.email,orderDetails.contactNumber,orderDetails.paymentMethod,orderDetails.totalAmount,orderDetails.productDetails,process.env.EMAIL],(err,results)=>{
        if(!err){
          ejs.renderFile(path.join(__dirname,'report.ejs'),{productDetails:productDetailsReport,name:orderDetails.name,email:orderDetails.email,contactNumber:orderDetails.contactNumber,paymentMethod:orderDetails.paymentMethod,totalAmount : orderDetails.totalAmount},(err,results)=>{
            if(err){
                return res.status(500).json(err);
            }
            else{
                pdf.create(results).toFile('./generated_pdf/'+ generateUuid + ".pdf",(err,results)=>{
                    if(err){
                        return res.status(500).json(err);
                    }
                    else{
                        return res.status(200).json({uuid:generateUuid})
                    }
                })
            }
          })
        }
        else{
            return res.status(500).json(err);
        }
    })
})

router.post('/getPdf',(req,res)=>{
    const orderDetails = req.body;
    const pdfPath = './generated_pdf/'+orderDetails.uuid+'.pdf';
    if(fs.existsSync(pdfPath)){
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res);
    }
    else{
        var productDetailsReport = JSON.parse(orderDetails.productDetails);
        ejs.renderFile(path.join(__dirname,'report.ejs'),{productDetails:productDetailsReport,name:orderDetails.name,email:orderDetails.email,contactNumber:orderDetails.contactNumber,paymentMethod:orderDetails.paymentMethod,totalAmount : orderDetails.totalAmount},(err,results)=>{
            if(err){
                return res.status(500).json(err);
            }
            else{
                pdf.create(results).toFile('./generated_pdf/'+ orderDetails.uuid + ".pdf",(err,results)=>{
                    if(err){
                        return res.status(500).json(err);
                    }
                    else{
                        res.contentType("application/pdf");
                        fs.createReadStream(pdfPath).pipe(res);
                    }
                })
            }
          })
    }   
})

router.get('/getBills',(req,res,next)=>{
   var query = "select * from bill order by id DESC";
   connection.query(query,(err,results)=>{
    if(!err){
        return res.status(200).json(results);
    }
    else{
        return res.status(500).json(err);
    }
   })

})

router.delete('/delete/:id',(req,res,next)=>{
    const id = req.params.id;
    var query = "delete from bill where id=?";
    connection.query(query,[id],(err,results)=>{
        if(!err){
           if(results.affectedRows == 0){
            return res.status(404).json({message:"Bill id not found"});
           }
           else{
              return res.status(200).json({message:"Bill deleted successfully"})
           }
        }
        else{
            return res.status(500).json
        }
    })
})

module.exports = router;