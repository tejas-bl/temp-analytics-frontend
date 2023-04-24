import React from 'react';
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Button } from 'react-bootstrap';

const PdfDownloader = ({rootElementId , downloadFileName}) => {

    const downloadPdfDocument = () => {
        const input = document.getElementById(rootElementId);
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: "landscape",
                    unit: "in",
                    format: [16, 16]
                  });
                pdf.addImage(imgData, 'JPEG', 0, 0);
                pdf.save(`${downloadFileName}.pdf`);
            })
    }

    return <Button onClick={downloadPdfDocument} className="btn btn-outline-primary btn-primary text-white"><span>Download </span> <i className="fa fa-download"></i> </Button>
                
}

export default PdfDownloader;