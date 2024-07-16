import { useState, useRef, useEffect } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Modal from "react-modal";

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
  };

  const handleTextDrop = (event) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    const updatedTextElements = textElements.map((element) => {
      if (element.id === parseInt(id)) {
        return {
          ...element,
          x: event.clientX - event.target.clientWidth / 2,
          y: event.clientY - event.target.clientHeight / 2,
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

  const handleSaveToPDF = () => {
    const modalContent = document.getElementById("modal-content");
    html2canvas(modalContent).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save("download.pdf");
    });
  };

  return (
    <div className="p-4">
      <input
        type="file"
        onChange={handleImageUpload}
        className="mb-4 block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400"
      />
      <button
        onClick={handleCropImage}
        className="mb-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
      >
        이미지 자르기
      </button>
      {imageSrc && (
        <div className="relative mx-auto h-[842px] w-[595px] border border-black">
          <img ref={imageRef} src={imageSrc} className="hidden" alt="Source" />
          <canvas ref={canvasRef} width="595" height="842"></canvas>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            width: "80%",
            height: "70%",
            margin: "auto",
            overflow: "auto",
          },
        }}
      >
        <div
          id="modal-content"
          className="relative mx-auto h-full w-full border border-black"
          onDrop={handleTextDrop}
          onDragOver={handleDragOver}
        >
          {croppedImage && (
            <img
              src={croppedImage}
              className="absolute left-0 top-0 h-full w-full"
              alt="Cropped"
            />
          )}
          <canvas ref={modalCanvasRef} width="100%" height="100%"></canvas>
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
