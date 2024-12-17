import { useState } from "react";
import { storage } from "./system/firebase.js";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { doc, setDoc } from "firebase/firestore";
import { db } from "./system/firebase.js";
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    date: "",
    location: "",
    reference: "",
    temperature: "",
    status: "",
    observations: "",
    image: null,
  });
  
  const [successMessage, setSuccessMensage] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // para texto
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // para botões
  const handleRadioChange = (e) => {
    const {value} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      status: value,
    }));
  };

  //imagem para o storage 
  const [file, setFile] = useState()
  const [id, setId] = useState()
  const [imageUrl, setImageUrl] = useState('');

  const getImage = (id) => {
    const storageRef = ref(storage, `test/${id}`)
    if (!storageRef) return
    getDownloadURL(storageRef).then((url) => {
      setImageUrl(url)
    })

  }
  const setImage = (image, id) => {
    const storageRef = ref(storage, `test/${id}`)
    uploadBytes(storageRef, image)

  }

  // enviar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const date = new Date();
    const id = date.getTime();

    try {
        let imageUrl = "";
        if (formData.image) {
            imageUrl = await setImage(formData.image, id);
        }

        const formRef = doc(db, "coralPosts", id.toString());
        await setDoc(formRef, {
            ...formData,
            imageUrl,
            id,
        });

        setSuccessMensage(true);
        setTimeout(() => setSuccessMensage(false), 3000);
        setFormData({
            date: "",
            location: "",
            reference: "",
            temperature: "",
            status: "",
            observations: "",
            image: null,
        });
    } catch (error) {
        console.error("Erro ao salvar dados no Firestore:", error);
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="container coral-form-container">
      <form className="coral-form">
        <h1 className="coral-form-title">🌊 Registro de Monitoramento de Corais</h1>

        <div className="form-group coral-form-group">
          <label htmlFor="date" className="form-label">Data</label>
          <input
            type="date"
            id="date"
            className="form-input"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group coral-form-group">
          <label htmlFor="location" className="form-label">Localização</label>
          <input
            type="text"
            id="location"
            className="form-input"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Digite o ponto de refêrencia"
            required />
        </div>

        <div className="form-group coral-form-group">
          <label htmlFor="reference" className="form-label">Ponto de Referência</label>
          <input
            type="text"
            id="reference"
            className="form-input"
            value={formData.reference}
            onChange={handleInputChange}
            placeholder="Digite o ponto de referência"
            required />
        </div>

        <div className="form-group coral-form-group">
          <label htmlFor="temperature" className="form-label">Temperatura(°C)</label>
          <input
            type="number"
            id="temperature"
            step="0.1"
            className="form-input"
            value={formData.temperature}
            onChange={handleInputChange}
            placeholder="Digite a temperatura"
            required />
        </div>

        <div className="form-group coral-form-group">
          <label className="form-label">Estado Físico dos Corais</label>
          <div className="coral-status">
            {["Excelente", "Bom", "Regular", "Ruim"].map((status) => (
              <div className="status-option coral-status-option" key={status}>
                <input
                  type="radio"
                  id={status}
                  name="status"
                  value={status}
                  className="status-radio"
                  checked={formData.status === status}
                  onChange={handleRadioChange}
                  required />
                <label htmlFor={status} className="status-label">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group coral-form-group">
          <label className="form-label">Imagem do coral</label>
          <div id="imagePreview" className={`image-preview coral-image-preview ${formData.image ? "" : "empty"}`}>
            <input type="file" className="file" onChange={(e) => { setFile(e.target.files[0]) }} />
            <img className="file_display" src={imageUrl || ""} />
            <button className="setImage" onClick={() => { setImage(file, id) }}>Enviar</button>
          </div>
        </div>

        <div className="form-group coral-form-group">
          <label htmlFor="observations" className="form-label">Observações</label>
          <textarea
            id="observations"
            rows="4"
            className="form-textarea"
            placeholder="Digite suas observações"
          />
        </div> 
        <button 
          type="submit"
          className="form-submit-btn"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "Enviando..." : "Enviar Registro"}
        </button>
      </form>
      {successMessage && (
        <div id="successMessage" className="sucess-message coral-success-mensage">
          Registro enviado com sucesso!
        </div>
      )}
    </div>
  );
}

export default App;