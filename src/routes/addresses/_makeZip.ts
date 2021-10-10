import type { Item } from '$lib/types';

import pdfMake from 'pdfmake';
import jszip from 'jszip';

pdfMake.fonts = {
  // download default Roboto font from cdnjs.com
  Roboto: {
    normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf'
    // italics:
    // 	'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
    // bolditalics:
    // 	'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
  }
};

const downloadFile = (blob, fileName) => {
  console.log('Download');

  const link = document.createElement('a');
  // create a blobURI pointing to our Blob
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  // some browser needs the anchor to be in the doc
  document.body.append(link);
  link.click();
  link.remove();
  // in case the Blob uses a lot of memory
  setTimeout(() => URL.revokeObjectURL(link.href), 7000);
};

export const download = async (territorys: { title: string; items: Item[] }[]): Promise<void> => {
  let totalDone = 0;
  let zip = new jszip();
  territorys.forEach(async (t) => {
    const doc = {
      content: [
        {
          text: t.title,
          fontSize: 25,
          alignment: 'center',
          lineHeight: 1,
          decoration: 'underline',
          bold: true
        },
        ' ',
        {
          ul: t.items.map((v) => {
            return {
              text: `${v.Text} (${v.Description})`,
              fontSize: 15,
              lineHeight: 1.5,
              bold: true
            };
          })
        }
      ],
      defaultStyle: {
        font: 'Roboto'
      }
    };
    pdfMake.createPdf(doc).getBlob(async (blob) => {
      zip.file(t.title + '.pdf', blob);
      totalDone++;
      if (totalDone === territorys.length) {
        downloadFile(
          await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 9 }
          }),
          territorys[0].title.slice(0, -2)
        );
      }
    });
  });
};
