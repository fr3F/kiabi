const fs = require("fs")
const db = require('../models')
const CarouselLink = db.carouselLink;
const pathProductImage = "assets/uploads/images/product/";

// Modifier le lien d'un slide
async function updateLien(image){
    if(!image.lien || !image.id) return;
    let old = await CarouselLink.findByPk(image.id);
    if(old)  
    CarouselLink.update({lien: image.lien}, {where: {id: image.id}}).then((data)=>{
    })
    else{
        creerImageSlide(image)
    }
}

// Creer un image slide
function creerImageSlide(image){
    let prefixe = ["", "-mobile", "-full"];
    CarouselLink.create(image);
    let imageName = image.image;
    let path = __basedir + "/assets/uploads/images/slides/"; 
    for(let i = 0; i < prefixe.length; i++){
        let n = "slide" + prefixe[i] + image.id + ".jpg";
        let defaultImage = "slide" + prefixe[i] + ".jpg";
        if(n != imageName){
            fs.copyFile(path + defaultImage, path + n, (data) =>{
                console.log('copied')
            });
        }
    }

}

// Supprimer lien
function supprimerLien(id, res){
    CarouselLink.destroy({where: {id: id}}).then((data)=>{
        res.send({message: "Carousel supprimé"})
    })
}

// Uploader une image(slide)
function uploadImageSlide(image){
    updateLien(image);
    if(image.imageFile && image.imageFile != {}){
        let nomFile = image.image;
        let path = __basedir + "/assets/uploads/images/slides/" + nomFile;
        uploadFile(image.imageFile, path);
    }
}

// Recuperer les liens pour le slide
async function getAllLinkCarousel(){
    return await db.carouselLink.findAll();
}


// Uploader un fichier base64 vers le serveur
function uploadFile(content, path){
    let writeStream = fs.createWriteStream(path);
    let base64result = content.substr(content.indexOf(',') + 1);
    // write some data with a base64 encoding
    writeStream.write(base64result, 'base64');
    writeStream.on('finish', () => {
        console.log('wrote all data to file');
    });
    writeStream.end();
}

// OUTPUT_path = "assets/uploads/compressedImages2/";

// const compress_images = require("compress-images");


// function compressImage(){
//     compress_images(INPUT_path_to_your_images, OUTPUT_path, { compress_force: false, statistic: true, autoupdate: true }, false,
//         { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
//         { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
//         { svg: { engine: "svgo", command: "--multipass" } },
//         { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
//     function (error, completed, statistic) {
//     }
//     );
// }

// const imagemin = require('imagemin');

// Chemin vers le dossier images produits
INPUT_path_to_your_images = "assets/uploads/images/product/*.{jpg,JPG,PNG,jpeg,JPEG,png,svg,SVG,gif,GIF}";
// Chemin vers le dossier image compresse
OUTPUT_path = "assets/uploads/compressedImages/product/";

// Compresser tous les images (produits)
async function compressImage(){
    const imagemin = (await import("imagemin")).default;
    const imageminJpegtran = (await import('imagemin-jpegtran')).default;
    const imageminPngquant = (await import('imagemin-pngquant')).default;
    // console.log("compress")
    imagemin([INPUT_path_to_your_images], {
        destination: OUTPUT_path,
        plugins: [
            imageminJpegtran({
                quality: "0"
            }),
            imageminPngquant({
                quality: "0"
            })
        ]
    });
    // console.log(files);
}


// Compresser une image
async function compressOneImage(imageName){
    const imagemin = (await import("imagemin")).default;
    const imageminJpegtran = (await import('imagemin-jpegtran')).default;
    const imageminPngquant = (await import('imagemin-pngquant')).default;
    // console.log("compress")
    let input = pathProductImage + imageName;
    imagemin([input], {
        destination: OUTPUT_path,
        plugins: [
            imageminJpegtran({
                quality: "0"
            }),
            imageminPngquant({
                quality: "0"
                // quality: [0.1, 0.2]
            })
        ]
    });
    // console.log(files);
}

module.exports  = {
    uploadFile,
    uploadImageSlide,
    getAllLinkCarousel, 
    supprimerLien,
    compressImage,
    compressOneImage
}