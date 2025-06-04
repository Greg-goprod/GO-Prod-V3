import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';

interface TemplateData {
  [key: string]: any;
}

export async function generateWordDocument(templateUrl: string, data: TemplateData) {
  try {
    // Fetch the template
    const response = await fetch(templateUrl);
    const templateContent = await response.arrayBuffer();

    // Load the docx file as a binary
    const zip = new PizZip(templateContent);
    
    // Create and configure Docxtemplater instance
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Render the document with data
    doc.render(data);

    // Generate output
    const out = doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    // Download the document
    saveAs(out, 'generated-document.docx');
  } catch (error) {
    console.error('Error generating Word document:', error);
    throw error;
  }
}