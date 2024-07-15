const TestComponent = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="image-container">
          <img src="/images/author.jpg" alt="example" className="image" />
          <button className="create-button">제작하기</button>
        </div>
      </div>
      <style jsx>{`
        .image-container {
          position: relative;
          width: 100%;
          height: 35vh; /* Viewport height의 35% */
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 25px; /* 끝을 라운드 처리 */
        }
        .create-button {
          position: absolute;
          right: 10%;
          transform: translateY(-50%);
          padding: 12px 24px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 25px; /* 끝을 라운드 처리 */
          font-size: 16px;
          font-weight: bold;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 그림자 추가 */
          cursor: pointer;
          transition: background-color 0.3s, box-shadow 0.3s; /* 부드러운 전환 효과 */
        }
        .create-button:hover {
          background-color: #0056b3;
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); /* 호버 시 더 강한 그림자 */
        }
      `}</style>
    </section>
  );
};

export default TestComponent;
