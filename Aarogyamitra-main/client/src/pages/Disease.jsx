import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './Disease.css';

const Disease = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [description, setDescription] = useState('');
  const [medications, setMedications] = useState([]);
  const [precautions, setPrecautions] = useState([]);
  const [activeTab, setActiveTab] = useState('prognosis');

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/data')
      .then(res => res.json())
      .then(data => setSymptoms(data.symptoms || []))
      .catch(err => console.error('Error fetching symptoms:', err));
  }, []);

  useEffect(() => {
    if (prediction) {
      fetch('http://localhost:5000/desc_disease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prediction }) // Matches Flask backend
      })
        .then(res => res.json())
        .then(data => {
          setDescription(data.description);
          setMedications(data.medications || []);
          setPrecautions(data.precautions || []);
        })
        .catch(err => console.error('Error fetching disease description:', err));
    }
  }, [prediction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/store_symptoms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms: selectedSymptoms.map(s => s.value) }),
    });

    const data = await response.json();
    setPrediction(data.prediction);
  };

  return (
    <div className="container disease-container">
      <h2>Disease Predictor</h2>
      <form onSubmit={handleSubmit}>
        <label>Select Symptoms:</label>
        <Select
          options={symptoms.map(symptom => ({ label: symptom, value: symptom }))}
          isMulti
          onChange={setSelectedSymptoms}
        />
        <button type="submit" className="btn btn-primary mt-3">Predict</button>
      </form>

      {prediction && (
        <div className="mt-4">
          <h4>Prediction: {prediction}</h4>
          <div className="mt-3 tab-button">
            <button
              className={`btn me-2 ${activeTab === 'prognosis' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setActiveTab('prognosis')}
            >Prognosis</button>
            <button
              className={`btn me-2 ${activeTab === 'medications' ? 'btn-info' : 'btn-outline-info'}`}
              onClick={() => setActiveTab('medications')}
            >Medications</button>
            <button
              className={`btn ${activeTab === 'precautions' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setActiveTab('precautions')}
            >Precautions</button>
          </div>
          <div className="mt-3">
            {activeTab === 'prognosis' && <p>{description}</p>}
            {activeTab === 'medications' && <ul>{medications.map((m, i) => <li key={i}>{m}</li>)}</ul>}
            {activeTab === 'precautions' && <ul>{precautions.map((p, i) => <li key={i}>{p}</li>)}</ul>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Disease;
