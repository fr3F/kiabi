const bwipjs = require('bwip-js');

async function genererBarCodeImage(barcode, scale = 5, width = 80, height = 20){
    const promise = new Promise((resolve, reject) => {
        const barcodeOptions = getBarcodeOptions(barcode, scale, height, width); 
        bwipjs.toBuffer(barcodeOptions, (err, buffer) => {
          if (err) {
            reject(err);
          } else {
            resolve(buffer.toString('base64'));
          }
        });
    });
    const resp = await promise;
    return 'data:image/png;base64,' + resp;
}

function getBarcodeOptions(barcode, scale, height, width){
    return {
        bcid: 'code128', // Type de code-barres (ici, code 128)
        text: barcode, // Données à inclure dans le code-barres
        scale, // Échelle du code-barres
        height, // Ajustez la hauteur ici selon vos besoins (en points)
        includetext: true, // Inclure le texte sous le code-barres
        width 
      };    
}

module.exports = {
    genererBarCodeImage
}