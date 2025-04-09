import './App.css'
import JSZip from 'jszip';
import { useState } from 'react';
import iconv from 'iconv-lite';

function App() {
  const [zipFile, setZipFile] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isJP, setIsJP] = useState(false);

  async function readFile(event) {
      let zip = new JSZip();

      for(let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];

        if (file) {
          // Read the file as an ArrayBuffer
          const arrayBuffer = await file.arrayBuffer();

          let text = "";
          if(isJP){
            const buffer = new Uint8Array(arrayBuffer);
            text = iconv.decode(buffer, 'Windows932');
          } else {
            const decoder = new TextDecoder('utf-16le');
            text = decoder.decode(arrayBuffer);
          }
          
          const fileName = file.name.substring(0, file.name.lastIndexOf('.'));

          console.log(text);

          let extractNames = text.replace(/\[名前 n\s?=\s?"([^"]+)"\]/g, '$1:');
          const removeExtraData = extractNames.replace(/\[.*?\]/g, "");
          const final = removeExtraData.replace(/\s\s+/g, '\n\n');

          zip.file(`${fileName}_formatted.txt`, final);
        }
      }
      setZipFile(zip);
      setLoaded(true);
  }

  async function saveFile() {
    const fileToDownload =  await zipFile.generateAsync({
      type: "blob",
      streamFiles: true
    })

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(fileToDownload);
    link.download = `formatted_files.zip`
    link.click();
  }

  return (
    <>
      <h1>Kirikiri script file cleaner</h1>
      <div className="card">
        <p>
          <input type="checkbox" id="isJP" name="isJP" value="isJP" checked={isJP} onChange={() => setIsJP(!isJP)}/>
          <label htmlFor="isJP">Check before uploading files if they're in Japanese</label>
        </p>
        <input type='file' onChange={(e) => {readFile(e), setLoaded(false)}} multiple/>
        { loaded && <button style={{marginTop:20}} onClick={saveFile}>Download .zip</button> }
      </div>
    </>
  )
}

export default App