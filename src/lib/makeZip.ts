import type { Territory } from '$lib/types';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from './vfs_fonts';
pdfMake.vfs = pdfFonts;

import jszip from 'jszip';

export const downloadFile = (blob: Blob, fileName: string): void => {
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

export const generate = async (
  territorys: Territory[],
  uint8array = false
): Promise<Blob | Uint8Array> => {
  return new Promise((resolve, reject) => {
    try {
      let totalDone = 0;
      const zip = new jszip();
      territorys.forEach(async (t) => {
        const doc = genDoc(t);
        pdfMake.createPdf(doc).getBlob(async (blob: Blob) => {
          zip.file(t.title + '.pdf', blob);
          totalDone++;
          if (totalDone === territorys.length) {
            resolve(
              await zip.generateAsync({
                type: uint8array ? 'uint8array' : 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 9 }
              })
            );
          }
        });
      });
    } catch (e) {
      reject(e);
    }
  });
};

const genDoc = (t: Territory): TDocumentDefinitions => {
  return {
    content: [
      {
        text: t.title,
        fontSize: 25,
        alignment: 'center',
        lineHeight: 1,
        bold: true
      },
      ' ',
      {
        ul: t.items.map((v) => {
          return {
            text: `${v.Text} ${v.Description}`,
            fontSize: 15,
            lineHeight: 1.5,
            bold: true
          };
        })
      }
    ]
  };
};
