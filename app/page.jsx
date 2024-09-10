// Ce fichier sera toujours rendu côté client
"use client";
import Image from "next/image";
import { useState } from "react";
import { ImageGenerator } from "./imageGenerator";
import { renderPNG } from "./render-png";
import { Resvg } from "@resvg/resvg-wasm";

export default function Home() {
  const [settings, setSettings] = useState({
    padding: 16,
    shadow: 4,
    radius: 8,
  });
  const [image, setImage] = useState();

  const setSetting = (name, value) => {
    setSettings((curr) => ({
      ...curr,
      [name]: value, // Utiliser des crochets pour définir une clé dynamique
    }));
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = function () {
      const img = new window.Image();

      img.onload = function () {
        setImage({
          width: img.width,
          height: img.height,
          src: img.src,
          name: file.name,
        });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className="flex justify-center items-center m-auto max-w-4xl max-lg:flex-col gap-8 min-h-full">
      <div class="card bg-base-200 w-96 shadow-xl">
        <div class="card-body">
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Pick a file</span>
            </div>
            <input
              type="file"
              class="file-input file-input-primary file-input-bordered w-full max-w-xs"
              onChange={handleFileChange}
            />
          </label>
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Radius</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.radius}
              onChange={(e) => setSetting("radius", Number(e.target.value))}
              class="range"
              step="5"
            />
          </label>
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Shadow</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.shadow}
              onChange={(e) => setSetting("shadow", Number(e.target.value))}
              class="range"
              step="5"
            />
          </label>
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Padding</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.padding}
              onChange={(e) => setSetting("padding", Number(e.target.value))}
              class="range"
              step="5"
            />
          </label>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div
            // style={(maxWidth = 400)}
            style={{ maxWidth: "400px" }}
            className="flex-1 border max-w-md lg:max-w-none overflow-hidden"
          >
            <ImageGenerator settings={settings} image={image} />
          </div>
          <div>
            <button
              className="btn"
              onClick={async () => {
                const { blod } = await renderPNG({
                  image,
                  settings,
                });
                const url = URL.createObjectURL(blod);

                const link = document.createElement("a");
                link.download = image.name.replace(".png", "elevation.png");
                link.href = url;
                link.click();
              }}
            >
              Dowload
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
