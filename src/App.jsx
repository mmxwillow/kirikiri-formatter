import './App.css'
import JSZip from 'jszip';
import { useState } from 'react';

function App() {
  const [zipFile, setZipFile] = useState(null);
  const [loaded, setLoaded] = useState(false);

  async function readFile(event) {
      let zip = new JSZip();

      for(let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];

        if (file) {
          const text = await new Response(file).text();
          const fileName = file.name.substring(0, file.name.lastIndexOf('.'));
          
          let extractNames = text.replace(/\[名前 n = "([^"]+)"\]/g, '$1:');
          const removeExtraData = extractNames.replace(/\[.*?\]/g, "");
          const final = removeExtraData.replace(/\s\s+/g, '\n');

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
        <input type='file' onChange={(e) => {readFile(e), setLoaded(false)}} multiple/>
        { loaded && <button style={{marginTop:20}} onClick={saveFile}>Download .zip</button> }
        <p>
          *for now you have to copy the contents of a .ks file to a new .txt file and then upload it here
        </p>
      </div>
    </>
  )
}

export default App