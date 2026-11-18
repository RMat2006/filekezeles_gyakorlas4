const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const fs = require('fs/promises');

//!Multer
const multer = require('multer'); //?npm install multer
const path = require('path');

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(__dirname, '../uploads'));
    },
    filename: (request, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname); //?egyedi név: dátum - file eredeti neve
    }
});

const upload = multer({ storage });

const ReadJSONFile = async (filePath)=>{
    try{
        const raw = await fs.readFile(filePath, 'utf8');
        return JSON.parse(raw)
    }catch(error){
        throw new Error("JSON olvasási hiba: ", error.message);
    }
};

//!Endpoints:
//*statisztikák
router.get('/stat', async(request,response)=>{
    try{
        const utvonal = path.join(__dirname, '../files/barlangok.json');
        const content = await ReadJSONFile(utvonal);

        let leghosszabb = 0;
        for(let i=0;i<content.length;i++){
            if(content[leghosszabb].hossz<content[i].hossz){
                leghosszabb = i;
            }
        }

        let legmelyebb= 0;
        for(let i=0;i<content.length;i++){
            if(content[legmelyebb].melyseg<content[i].melyseg){
                legmelyebb = i;
            }
        }

        let fokozottanVedett = 0;
        for(let i=0;i<content.length;i++){
            if(content[i].vedettseg == "fokozottan védett"){
                fokozottanVedett++;
            }
        }

        response.status(200).json({
            leghosszabb:content[leghosszabb].nev,
            legmelyebb:content[legmelyebb].nev,
            darab:content.length,
            fokozottan:fokozottanVedett
        })
    }catch(error){
        response.status(500).json({
            message:"Hiba!"
        });
    }
});



//*azonosítója elérése
router.get('/barlang/:azon', async (request,response)=>{
    try{
        const azonosito = request.params.azon;
        const utvonal = path.join(__dirname, '../files/barlangok.json');
        const content = await ReadJSONFile(utvonal);
        let j=0;
        while(j<content.length && content[j].azon!=azonosito){
            j++;
        }
        response.status(200).json({
            success:true,
            barlang: content[j]
        });
        
    }catch(error){
        response.status(500).json({
            success:false
        })
    }
});



//*Json beolvasas
router.get('/barlangok', async(request,response)=>{
    try{
        const utvonal = path.join(__dirname, '../files/barlangok.json');
        const content = await ReadJSONFile(utvonal);

        response.status(200).json({
            success: true,
            content:content
        });
    }catch(error){
        response.status(500).json({
            success:true
        });
    }
});



//?GET /api/test
router.get('/test', (request, response) => {
    response.status(200).json({
        message: 'Ez a végpont működik.'
    });
});

//?GET /api/testsql
router.get('/testsql', async (request, response) => {
    try {
        const selectall = await database.selectall();
        response.status(200).json({
            message: 'Ez a végpont működik.',
            results: selectall
        });
    } catch (error) {
        response.status(500).json({
            message: 'Ez a végpont nem működik.'
        });
    }
});

module.exports = router;
