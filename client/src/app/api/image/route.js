import { createCanvas, registerFont, ImageData } from 'canvas';
import { GifCodec, GifFrame, BitmapImage } from 'gifwrap';
import { getDecodedGifFrames } from '../../util/utils';
import path from 'path';
import { NextResponse } from 'next/server';

// Load font once
const fontPath = path.join(process.cwd(), 'public', 'c64.ttf');
registerFont(fontPath, { family: 'C64' });

export async function GET(req) {
  try {
    const traits = req.nextUrl.searchParams;
    const [tokenId, charLimit, level] = Array.from(traits.values());

    const width = 800;
    const height = 800;
    const endChar = '*';

    // Reuse cached decoded frames
    const baseFrames = await getDecodedGifFrames();

    // Prepare overlay canvas once
    const overlayCanvas = createCanvas(width, height);
    const ctx = overlayCanvas.getContext('2d');

    ctx.clearRect(0, 0, width, height);
    ctx.font = "bold 24px C64";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";

    tokenId && ctx.fillText(`${endChar} DISK ID #${tokenId.padStart(3, '0')} ${endChar}`, width / 2, 75);
    level && ctx.fillText(`${endChar} LEVEL ${level.padStart(2, '0')} ${endChar}`, width / 2, height - 95);
    charLimit && ctx.fillText(`${endChar} CHAR LIMIT ${charLimit.padStart(5, '0') || "N/A"} ${endChar}`, width / 2, height - 70);
    charLimit && ctx.fillText(`[mint to write]`, width / 2, 100);

    // Compose new frames
    const newFrames = baseFrames.map(frame => {
      const frameCanvas = createCanvas(width, height);
      const frameCtx = frameCanvas.getContext('2d');

      const imageData = new ImageData(
        new Uint8ClampedArray(frame.bitmap.data),
        frame.bitmap.width,
        frame.bitmap.height
      );

      frameCtx.putImageData(imageData, 0, 0);
      frameCtx.drawImage(overlayCanvas, 0, 0, width, height);

      const finalData = frameCtx.getImageData(0, 0, width, height);

      return new GifFrame(new BitmapImage({
        width: finalData.width,
        height: finalData.height,
        data: Buffer.from(finalData.data),
      }));
    });

    // Encode GIF
    const codec = new GifCodec();
    const encodedGif = await codec.encodeGif(newFrames, { loops: 0 });

    return new NextResponse(encodedGif.buffer, {
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });

  } catch (err) {
    console.error('❌ Image Generation Error:', err);
    return NextResponse.json({ error: 'Image generation failed' }, { status: 500 });
  }
}
