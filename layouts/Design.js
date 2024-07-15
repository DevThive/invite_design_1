import React, { useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import config from "@config/config";
import { markdownify } from "@lib/utils/textConverter";
import { getCroppedImg } from "@lib/utils/cropImage";

const Design = ({ data }) => {
  const { frontmatter } = data;
  const { title } = frontmatter;

  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [maintitle, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [kakaoId, setKakaoId] = useState("");
  const [businessHours, setBusinessHours] = useState("");
  const [posterText, setPosterText] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [textSize, setTextSize] = useState(16);
  const [fontType, setFontType] = useState("Arial");
  const posterRef = useRef(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = (imageSrc, croppedAreaPixels) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        context.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );
        resolve(canvas.toDataURL("image/png"));
      };
      image.onerror = (error) => reject(error);
    });
  };

  const showCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels) {
      console.error("Cropped area pixels not set");
      return;
    }

    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);

  const downloadPoster = async () => {
    const canvas = await html2canvas(posterRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("poster.pdf");
  };
  const onFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", () => setImageSrc(reader.result));
    reader.readAsDataURL(file);
  };

  // const downloadPoster = async () => {
  //   const canvas = await html2canvas(posterRef.current, {
  //     scale: 2, // 해상도를 높이기 위해 스케일을 조정
  //   });

  //   const imgData = canvas.toDataURL("image/png");
  //   const pdf = new jsPDF("p", "mm", "a4");

  //   // A4 크기에 맞게 이미지 크기를 조정
  //   const imgWidth = 210;
  //   const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //   pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  //   pdf.save("poster.pdf");
  // };

  return (
    <section className="section">
      <div className="container max-w-[700px]">
        {markdownify(title, "h1", "h2 mb-8 text-center")}
        <div className="mb-6">
          <label className="mb-2 block" htmlFor="upload">
            이미지 업로드
          </label>
          <input
            className="form-input w-full"
            type="file"
            accept="image/*"
            onChange={onFileChange}
          />
        </div>
        {imageSrc && (
          <>
            <div
              className="crop-container mb-4"
              style={{
                position: "relative",
                width: "210mm",
                height: "297mm",
                maxWidth: "100%",
                backgroundColor: "#333",
                margin: "0 auto",
              }}
            >
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={210 / 297}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <button
              className="btn btn-outline-primary mt-4"
              onClick={showCroppedImage}
            >
              이미지 자르기
            </button>
            {croppedImage && (
              <div className="mt-4">
                <div>
                  <label className="mb-2 block" htmlFor="title">
                    타이틀
                  </label>
                  <input
                    className="form-input mb-2 w-full"
                    type="text"
                    id="title"
                    value={maintitle}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <label className="mb-2 block" htmlFor="subtitle">
                    서브 타이틀
                  </label>
                  <input
                    className="form-input mb-2 w-full"
                    type="text"
                    id="subtitle"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                  />

                  <label className="mb-2 block" htmlFor="kakaoId">
                    카카오아이디
                  </label>
                  <input
                    className="form-input mb-2 w-full"
                    type="text"
                    id="kakaoId"
                    value={kakaoId}
                    onChange={(e) => setKakaoId(e.target.value)}
                  />

                  <label className="mb-2 block" htmlFor="businessHours">
                    영업시간
                  </label>
                  <input
                    className="form-input mb-2 w-full"
                    type="text"
                    id="businessHours"
                    value={businessHours}
                    onChange={(e) => setBusinessHours(e.target.value)}
                  />

                  <label className="mb-2 block" htmlFor="posterText">
                    포스터 텍스트
                  </label>
                  <input
                    className="form-input mb-2 w-full"
                    type="text"
                    id="posterText"
                    value={posterText}
                    onChange={(e) => setPosterText(e.target.value)}
                  />

                  <label className="mb-2 block" htmlFor="textColor">
                    텍스트 색상
                  </label>
                  <input
                    className="form-input mb-2 w-full"
                    type="color"
                    id="textColor"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                  />

                  <label className="mb-2 block" htmlFor="textSize">
                    텍스트 크기
                  </label>
                  <input
                    className="form-input mb-2 w-full"
                    type="number"
                    id="textSize"
                    value={textSize}
                    onChange={(e) => setTextSize(e.target.value)}
                  />

                  <label className="mb-2 block" htmlFor="fontType">
                    폰트 타입
                  </label>
                  <select
                    className="form-input mb-2 w-full"
                    id="fontType"
                    value={fontType}
                    onChange={(e) => setFontType(e.target.value)}
                  >
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Verdana">Verdana</option>
                    {/* 필요한 폰트를 여기 추가하세요 */}
                  </select>
                </div>
                <div>
                  <div
                    ref={posterRef}
                    className="poster-preview relative mt-4"
                    style={{
                      width: "210mm",
                      height: "297mm",
                      maxWidth: "100%",
                      backgroundColor: "#ffffff",
                      margin: "0 auto",
                    }}
                  >
                    <img
                      src={croppedImage}
                      alt="Poster Background"
                      className="h-full w-full object-cover"
                    />
                    <div
                      className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center"
                      style={{
                        color: "#000",
                        fontSize: "24px",
                        fontFamily: "Arial, sans-serif",
                      }}
                    >
                      <div className="mb-2 text-center">{maintitle}</div>
                      <div className="text-center">포스터 텍스트</div>
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-outline-primary mt-4"
                  onClick={downloadPoster}
                >
                  포스터 다운로드
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Design;
