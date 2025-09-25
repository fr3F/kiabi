

// Modifier header reponse attachement
function setHeaderResponseAttachementPdf(res, filename){
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + filename + ";"
    );
}


// Option pour generer pdf(paysage)
const OPTION_PDF_PAYSAGE = {
    format: "A4",
    orientation: "landscape",
    border: "6mm",
    timeout: '1000000',
    header: {
        height: '0mm',
    },
    footer: {
        height: '0mm',
        contents: {
            default:
            '<div id="pageFooter" style="text-align: right; font-size: 12pt;">{{page}}/{{pages}}</div>',
        },
    },
};


const OPTION_PDF_PORTRAIT = {
    format: "A4",
    orientation: "portrait",
    border: "8mm",
    timeout: '1000000',
    header: {
        height: '5mm',
    },
    footer: {
        height: '15mm',
        contents: {
            default:
            '<div id="pageFooter" style="text-align: right; font-size: 12pt;">{{page}}/{{pages}}</div>',
        },
    },
}
module.exports = {
    setHeaderResponseAttachementPdf,
    OPTION_PDF_PAYSAGE,
    OPTION_PDF_PORTRAIT
}