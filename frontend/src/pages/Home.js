import React, { useState } from 'react';
import './Home.css'; // 👉 Đừng quên import file CSS

function Home() {
  const [showCalculator, setShowCalculator] = useState(false);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('male');
  const [size, setSize] = useState('');

  const calculateSize = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (isNaN(h) || isNaN(w) || h === 0) return setSize("Dữ liệu không hợp lệ");

    const bmi = w / (h * h);
    let result = '';

    if (gender === 'male') {
      if (height < 160) result = bmi < 18.5 ? 'XS' : bmi < 25 ? 'S' : bmi < 30 ? 'M' : 'L';
      else if (height < 170) result = bmi < 18.5 ? 'S' : bmi < 25 ? 'M' : bmi < 30 ? 'L' : 'XL';
      else if (height < 180) result = bmi < 18.5 ? 'M' : bmi < 25 ? 'L' : bmi < 30 ? 'XL' : 'XXL';
      else result = bmi < 18.5 ? 'L' : bmi < 25 ? 'XL' : bmi < 30 ? 'XXL' : 'XXXL';
    } else {
      if (height < 155) result = bmi < 18.5 ? 'XXS' : bmi < 25 ? 'XS' : bmi < 30 ? 'S' : 'M';
      else if (height < 165) result = bmi < 18.5 ? 'XS' : bmi < 25 ? 'S' : bmi < 30 ? 'M' : 'L';
      else if (height < 175) result = bmi < 18.5 ? 'S' : bmi < 25 ? 'M' : bmi < 30 ? 'L' : 'XL';
      else result = bmi < 18.5 ? 'M' : bmi < 25 ? 'L' : bmi < 30 ? 'XL' : 'XXL';
    }

    setSize(result);
  };

  return (
    <div className="home-container">
      <button
        className="lightbulb-btn"
        onClick={() => setShowCalculator(!showCalculator)}
        title="Tính size"
      >
        💡
      </button>

      {showCalculator && (
        <div className="calculator-card">
          <h2>Dự đoán Size Quần Áo</h2>

          <label>Giới tính:</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>

          <label>Chiều cao (cm):</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="VD: 170"
          />

          <label>Cân nặng (kg):</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="VD: 65"
          />

          <button onClick={calculateSize} className="submit-btn">
            Tính Size
          </button>

          {size && <div className="result">👉 Size phù hợp: <strong>{size}</strong></div>}
        </div>
      )}
    </div>
  );
}

export default Home;
