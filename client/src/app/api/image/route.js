import { NextResponse } from "next/server";
import { createCanvas, ImageData, registerFont } from "canvas";
import fs from "fs";
import path from "path";
import { GifCodec, GifFrame, GifUtil, BitmapImage } from "gifwrap";

const endChar = '*'

const gifPath = path.join(process.cwd(), "public", "disk_black_medium.gif");
const gifBuffer = fs.readFileSync(gifPath);
const codec = new GifCodec();
const decodedGifPromise = codec.decodeGif(gifBuffer);

const fontPath = path.join(process.cwd(), "public", "c64.ttf");
registerFont(fontPath, { family: "C64" });

const createOverlayCanvas = ({tokenId, level, charLimit }, width, height) => {
  // Create an overlay canvas and draw your overlay text once.
  const overlayCanvas = createCanvas(width, height);
  const overlayCtx = overlayCanvas.getContext("2d");

  overlayCtx.clearRect(0, 0, width, height);
  overlayCtx.font = "bold 20px C64";
  overlayCtx.textAlign = "center";
  overlayCtx.fillStyle = "black";

  // align text on overlay convas
  tokenId && overlayCtx.fillText(`${endChar} DISK ID #${tokenId.padStart(3, '0')} ${endChar}`, width / 2, 75)
  level && overlayCtx.fillText(`${endChar} LEVEL ${level.padStart(2, '0')} ${endChar}`, width / 2, height - 95);
  charLimit && overlayCtx.fillText(`${endChar} CHAR LIMIT ${charLimit.padStart(5, '0') || "N/A"} ${endChar}`, width / 2, height - 60);
  charLimit && overlayCtx.fillText(`[mint to write]`, width / 2, 100)

  return overlayCanvas
}

const applyOverlay = (decodedGif, overlayCanvas, width, height) => {
  return decodedGif.frames.map(frame => {
    const frameCanvas = createCanvas(width, height);
    const frameCtx = frameCanvas.getContext("2d");

    const imageData = new ImageData(
      new Uint8ClampedArray(frame.bitmap.data),
      frame.bitmap.width,
      frame.bitmap.height
    )

    frameCtx.fillStyle = 'white';
    frameCtx.fillRect(0, 0, width, height); // fill canvas white first
    
    // draw gif and overlay convas on top
    frameCtx.putImageData(imageData, 50, 50);
    frameCtx.drawImage(overlayCanvas, 0, 0, width, height);

    const compositeImageData = frameCtx.getImageData(0, 0, width, height);
    const bitmapImage = new BitmapImage({
      width: compositeImageData.width,
      height: compositeImageData.height,
      data: Buffer.from(compositeImageData.data)
    });

    return new GifFrame(bitmapImage)
  })
}

export async function GET(req) {
  try {
    const traits = req.nextUrl.searchParams;
    const [tokenId, charLimit, level] = Array.from(traits.values());

    if (!tokenId) {
      console.error("Missing tokenId");
      return NextResponse.json({ error: "Missing tokenId" }, { status: 400 });
    }

    // Load the GIF from disk
    if (!fs.existsSync(gifPath)) {
      console.error("GIF file not found at path:", gifPath);
      return NextResponse.json({ error: "GIF file not found" }, { status: 500 });
    }

    const decodedGif = await decodedGifPromise

    const width = 600;
    const height = 600;

    const overlayCanvas = createOverlayCanvas({
      tokenId,
      level,
      charLimit
    }, width, height)

    const newFrames = applyOverlay(
      decodedGif,
      overlayCanvas,
      width,
      height
    )

    // Encode the quantized frames into a GIF.
    const encodedGif = await codec.encodeGif(newFrames, { loops: 0 });

    return new NextResponse(encodedGif.buffer, {
      headers: { "Content-Type": "image/gif" },
    });
  } catch (err) {
    console.log('Error Generating Image', err)
    return NextResponse.json({ error: err, message: 'Failed Image Generation' }, { status: 500 })
  }
}

