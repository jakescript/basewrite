import { NextResponse } from "next/server";
import { createCanvas, ImageData, registerFont } from "canvas";
import fs from "fs";
import path from "path";
import { GifCodec, GifFrame, GifUtil, BitmapImage } from "gifwrap";

// Register your custom font from the public directory
const fontPath = path.join(process.cwd(), "public", "c64.ttf");
registerFont(fontPath, { family: "C64" });

export async function GET(req) {
  try {
    const traits = req.nextUrl.searchParams;
    const [tokenId, charLimit, level] = Array.from(traits.values());

    if (!tokenId) {
      console.error("Missing tokenId");
      return NextResponse.json({ error: "Missing tokenId" }, { status: 400 });
    }

    // Load the GIF from disk
    const gifPath = path.join(process.cwd(), "public", "disk_black_medium.gif");
    if (!fs.existsSync(gifPath)) {
      console.error("GIF file not found at path:", gifPath);
      return NextResponse.json({ error: "GIF file not found" }, { status: 500 });
    }

    const gifBuffer = fs.readFileSync(gifPath);

    // Decode the GIF using GifCodec
    const codec = new GifCodec();
    const decodedGif = await codec.decodeGif(gifBuffer);

    // Use GIF dimensions if available, otherwise default to 500x500
    const width = decodedGif.width || 800;
    const height = decodedGif.height || 800;

    const endChar = '*'

    // Create an overlay canvas and draw your overlay text once.
    const overlayCanvas = createCanvas(width, height);
    const overlayCtx = overlayCanvas.getContext("2d");

    overlayCtx.clearRect(0, 0, width, height);
    overlayCtx.font = "bold 24px C64";
    overlayCtx.textAlign = "center";
    overlayCtx.fillStyle = "black";

    // align text on overlay convas
    tokenId && overlayCtx.fillText(`${endChar} DISK ID #${tokenId.padStart(3, '0')} ${endChar}`, width / 2, 75)
    level && overlayCtx.fillText(`${endChar} LEVEL ${level.padStart(2, '0')} ${endChar}`, width / 2, height - 95);
    charLimit && overlayCtx.fillText(`${endChar} CHAR LIMIT ${charLimit.padStart(5, '0') || "N/A"} ${endChar}`, width / 2, height - 70);
    charLimit && overlayCtx.fillText(`[mint to write]`, width / 2, 100)

    // Process each decoded frame and create new GifFrames with the overlay applied.
    const newFrames = [];
    const bitmapImages = []
    for (let i = 0; i < decodedGif.frames.length; i++) {
      const frame = decodedGif.frames[i];
      
      // Create a canvas for this frame.
      const frameCanvas = createCanvas(width, height);
      const frameCtx = frameCanvas.getContext("2d");

      let imageData;

      if (frame.bitmap.data) {
        imageData = new ImageData(new Uint8ClampedArray(frame.bitmap.data), frame.bitmap.width, frame.bitmap.height);
      }

      // draw gif and overlay convas on top
      frameCtx.putImageData(imageData, 0, 0);
      frameCtx.drawImage(overlayCanvas, 0, 0, width, height);

      // Get the composite image data.
      const compositeImageData = frameCtx.getImageData(0, 0, width, height);

      const bitmapImage = new BitmapImage({
        width: compositeImageData.width,
        height: compositeImageData.height,
        data: Buffer.from(compositeImageData.data)
      });

      // Create a new GifFrame with the composite image data.
      const newFrame = new GifFrame(bitmapImage)
      newFrames.push(newFrame);
    }

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

