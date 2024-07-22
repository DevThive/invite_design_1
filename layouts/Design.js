import { useState, useRef, useEffect } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Modal from "react-modal";
import Image from "next/image";

const Design = ({ data }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [cropper, setCropper] = useState(null);
  const [textElements, setTextElements] = useState([]);
  const [textColor, setTextColor] = useState("#000000");
  const [textSize, setTextSize] = useState(16);
  const [textFont, setTextFont] = useState("Arial");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);

  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const modalCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem("access_token");
      const token = storedToken;

      if (!token) {
        alert("로그인 이후에 이용해주세요.");

        window.location.href = "/"; // 메인 페이지로 이동
      }
    };
    initAuth();
  });

  useEffect(() => {
    if (imageSrc && imageRef.current) {
      const cropperInstance = new Cropper(imageRef.current, {
        aspectRatio: 595 / 842, // A4 비율
        viewMode: 1,
      });
      setCropper(cropperInstance);
    }
  }, [imageSrc]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleTextGeneration = () => {
    const modalContent = document.getElementById("modal-content");
    const centerX = modalContent.clientWidth / 2;
    const centerY = modalContent.clientHeight / 2;

    setTextElements([
      ...textElements,
      {
        id: Date.now(),
        text: "텍스트 입력",
        x: centerX,
        y: centerY,
        color: textColor,
        size: textSize,
        font: textFont,
      },
    ]);
  };

  const handleTextDragStart = (event, id) => {
    event.dataTransfer.setData("text/plain", id);
    event.dataTransfer.setDragImage(new Image(), 0, 0); // 투명한 이미지로 드래그 이미지를 설정하여 기본 드래그 이미지를 숨김
  };

  const handleTextDrop = (event) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    const modalContent = document.getElementById("modal-content");
    const rect = modalContent.getBoundingClientRect();
    const updatedTextElements = textElements.map((element) => {
      if (element.id === parseInt(id)) {
        return {
          ...element,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
      }
      return element;
    });
    setTextElements(updatedTextElements);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleCropImage = () => {
    if (cropper) {
      const canvas = cropper.getCroppedCanvas();
      setCroppedImage(canvas.toDataURL());
      setIsModalOpen(true);
    }
  };

  const handleLogoClick = () => {
    fileInputRef.current.click();
  };

  // PDF 저장 핸들러 함수
  const handleSaveToPDF = async () => {
    const input = document.getElementById("modal-content");
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "px", [794, 1123]); // A4 크기로 설정
    pdf.addImage(imgData, "PNG", 0, 0, 794, 1123);
    pdf.save("download.pdf");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      {!imageSrc && (
        <div className="flex h-[842px] w-[595px] flex-col items-center justify-center border-2 border-dotted border-gray-300 bg-white">
          <Image
            src="/images/uploadlogo.png" // 로고 이미지 URL을 넣으세요
            alt="Logo"
            className="mb-4 cursor-pointer"
            onClick={handleLogoClick}
            style={{ width: "20%", height: "10%" }}
          />
          <input
            type="file"
            onChange={handleImageUpload}
            className="hidden"
            ref={fileInputRef}
          />
          <p className="text-gray-500">이미지를 업로드 해주세요</p>
        </div>
      )}
      {imageSrc && (
        <div className="relative mx-auto h-[842px] w-[595px] border border-black">
          <Image
            ref={imageRef}
            src={imageSrc}
            className="hidden"
            alt="Source"
          />
          <canvas ref={canvasRef} width="595" height="842"></canvas>
          <button
            onClick={handleCropImage}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 transform rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
          >
            이미지 자르기
          </button>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            width: "90%", // 모달의 너비를 적절하게 설정
            height: "auto",
            margin: "auto",
            overflow: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999, // 높은 z-index 값을 설정하여 모달이 최상위에 위치하도록 함
          },
          overlay: {
            zIndex: 9998, // 모달 오버레이도 높게 설정
          },
        }}
      >
        <div
          id="modal-content"
          className="relative border border-black"
          style={{
            width: "90%",
            height: "80%",
            position: "relative",
            maxWidth: "794px",
            maxHeight: "1123px",
          }}
          onDrop={handleTextDrop}
          onDragOver={handleDragOver}
        >
          {croppedImage && (
            <Image
              src={croppedImage}
              className="absolute left-0 top-0"
              style={{
                width: "100%", // A4 크기에 맞게 조정
                height: "100%", // 비율 유지
                maxWidth: "794px",
                maxHeight: "1123px",
                objectFit: "contain",
              }}
              alt="Cropped"
            />
          )}
          <canvas ref={modalCanvasRef} style={{ display: "none" }}></canvas>
          {textElements.map((element) => (
            <div
              key={element.id}
              contentEditable
              className="absolute cursor-move"
              style={{
                top: `${element.y}px`,
                left: `${element.x}px`,
                color: element.color,
                fontSize: `${element.size}px`,
                fontFamily: element.font,
              }}
              draggable
              onDragStart={(e) => handleTextDragStart(e, element.id)}
            >
              {element.text}
            </div>
          ))}
        </div>
        <div className="mb-4 flex space-x-4">
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="rounded border border-gray-300 p-2"
          />
          <input
            type="number"
            value={textSize}
            onChange={(e) => setTextSize(parseInt(e.target.value))}
            className="rounded border border-gray-300 p-2"
          />
          <input
            type="text"
            value={textFont}
            onChange={(e) => setTextFont(e.target.value)}
            className="rounded border border-gray-300 p-2"
          />
        </div>
        <button
          onClick={handleTextGeneration}
          className="mb-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
        >
          텍스트 생성
        </button>
        <button
          onClick={handleSaveToPDF}
          className="mb-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700"
        >
          PDF로 저장
        </button>
      </Modal>
    </div>
  );
};

export default Design;
